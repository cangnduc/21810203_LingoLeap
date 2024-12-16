import asyncio
import os
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm, stt, tokenize, tts, vad
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.agents.llm import ChatContext, ChatMessage, ChatImage, ChatRole
from livekit.plugins import deepgram, openai, silero, google
from livekit import rtc, api
from dotenv import load_dotenv
import json
from typing import Optional
from functx import AssistantFnc
from mongo import save_speaking_result
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join("..", 'Backend', '.env')
load_dotenv(dotenv_path=env_path)
credentials = json.loads(os.getenv("GOOGLE_CREDENTIALS"))


class EnhancedVoiceAssistant(VoiceAssistant):
    def __init__(self, *, exam_duration: float = 60, test_attempt_id: str, ctx: JobContext, **kwargs):
        
        super().__init__(**kwargs)
        self.exam_duration = exam_duration
        self.exam_timer: Optional[asyncio.Task] = None
        self.conversation = []
        self.ctx = ctx
        self.participant_identity = None
        self.current_speaker = "assistant"
        self.user_name = None
        self.test_metadata = None
       
        self.test_attempt_id = test_attempt_id
          
    def _update_current_speaker(self, role: str) -> None:
        self.current_speaker = role
        print(f"Current speaker: {self.current_speaker}")

    def start(
        self, room: rtc.Room, participant: rtc.RemoteParticipant | str | None = None
    ) -> None:
        super().start(room, participant)
        
        if participant:
            self.participant_identity = participant if isinstance(participant, str) else participant.identity
            # Extract metadata from participant
            if isinstance(participant, rtc.RemoteParticipant):
                try:
                    self.test_metadata = json.loads(participant.metadata)
                    print(f"Test metadata: {self.test_metadata}")
                except:
                    print("Failed to parse participant metadata")
            
            #print(f"Participant joined: {self.participant_identity}")
            self.user_name = self.participant_identity
        self.exam_timer = asyncio.create_task(self._run_exam_timer())
        self.on("user_speech_committed", self._on_speech_committed)
        self.on("agent_speech_committed", self._on_speech_committed)
        self.on("user_started_speaking", lambda: self._update_current_speaker("user"))
        self.on("agent_started_speaking", lambda: self._update_current_speaker("assistant"))
        self.on("user_stopped_speaking", lambda: self._update_current_speaker("assistant") if self.current_speaker != "user" else None)
        self.on("agent_stopped_speaking", lambda: self._update_current_speaker("user") if self.current_speaker != "assistant" else None)
        


    async def _run_exam_timer(self) -> None:
        await asyncio.sleep(self.exam_duration)
        await self.provide_feedback()
      
    
    def _on_speech_committed(self, message: ChatMessage) -> None:
        self.conversation.append({"role": message.role, "content": message.content})
        #print(self.conversation[-1])           
         
    async def provide_feedback(self) -> None:
        conversation_text = "\n".join([f"{message['role']}: {message['content']}" for message in self.conversation])
        print("Conversation transcript: " + conversation_text)
        feedback_prompt = (
            f"""Speakers transcript: {conversation_text}
            Based on the conversation, provide a score for user's performance strictly (out of 100) 
            and brief feedback on the user role English speaking skill. 
            Consider fluency, pronunciation, vocabulary usage, and overall communication skills. 
            Format your response as follows:
            Fluency: [numerical score]
            Pronunciation: [numerical score]
            Vocabulary: [numerical score]
            Overall communication: [numerical score]
            Total score: [mean of Fluency, Pronunciation, Vocabulary, and Overall communication]
            Feedback: [your feedback]"""
        )

        feedback_context = self.chat_ctx.copy()
        feedback_context.messages.append(ChatMessage(role="system", content=feedback_prompt))
        print(feedback_context)
        feedback_stream = self.llm.chat(chat_ctx=feedback_context)
        feedback_text = ""
        async for chunk in feedback_stream:
            content = chunk.choices[0].delta.content
            if content:
                feedback_text += content

        # Speak the feedback
        #print(feedback_text)
        await save_speaking_result(self.test_attempt_id, feedback_text)
        await asyncio.sleep(2)       
        await self.say("I apologize for interrupting. The test is now over. here is your feedback.", allow_interruptions=False, add_to_chat_ctx=False)
       
        await asyncio.sleep(2)
        await self.say(feedback_text, allow_interruptions=False, add_to_chat_ctx=False)
        await self.say("Room will be closed shortly")
        

       
async def get_video_track(room: rtc.Room):
    """Get the first video track from the room. We'll use this track to process images."""
    video_track = asyncio.Future[rtc.RemoteVideoTrack]()
    for participant in room.remoteParticipants.values():
        for _, track_publication in participant.tracks.items():
            if track_publication.track is not None and isinstance(
                track_publication.track, rtc.RemoteVideoTrack
            ):
                video_track.set_result(track_publication.track)
                print(f"Using video track {track_publication.track.sid}")
                break
    return await video_track

async def entrypoint(ctx: JobContext):
    # Create an initial chat context with a system prompt
   
    fnc_ctx = AssistantFnc()
    async def participant_entrypoint(ctx: JobContext,participant: rtc.RemoteParticipant):
        print(f"Participant joined: {participant.identity}")
       
        #fetch the participant's name from the database

    ctx.add_participant_entrypoint(participant_entrypoint)

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for a participant to join and get their identity
    participant = await ctx.wait_for_participant()
    test_metadata = json.loads(participant.metadata)
   
    second = 10
    exam_duration = int(test_metadata['duration']) * second
    test_attempt_id = test_metadata['testAttemptId']
    initial_ctx = llm.ChatContext().append(
            role="system",
            text=(
                f"""You are an English examiner a speaking test for {participant.identity}. Your role is to assess the speaker's fluency, pronunciation, and communication flow. You will ask questions and engage in conversation with the speaker based on topic {test_metadata['question']} remember to stay focused on the topic. Use clear and concise language, but feel free to use a range of vocabulary and structures appropriate for the test. After the conversation, provide a score and brief feedback on the speaker's performance. Remember to maintain a professional and encouraging demeanor throughout the test"""
            
            ),
        )
    lastest_image: rtc.VideoFrame | None = None
    assistant = EnhancedVoiceAssistant(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=google.TTS(credentials_info=credentials, voice_name="en-US-News-N"),
        chat_ctx=initial_ctx,
        exam_duration=exam_duration,  # Set the exam duration to 60 seconds
        test_attempt_id=test_attempt_id,
        ctx=ctx,
        fnc_ctx=fnc_ctx,
    )

    # Start the voice assistant with the room and the participant
    assistant.start(ctx.room, participant)
    chat = rtc.ChatManager(ctx.room)
    async def answer_from_text(text: str, use_image: bool = False):
        """
        This function is used to answer the user's message and optionally the lasted image captured from the video track
        """
        args = {}
        if use_image and lastest_image:
            args["images"]  = [ChatImage(image=lastest_image)]
        chat_ctx = assistant.chat_ctx.copy()
        chat_ctx.append(role=ChatRole.USER, text=text, **args)
        stream = assistant.llm.chat(chat_ctx=chat_ctx)
        await assistant.say(stream)

    @chat.on("message_received")
    def on_message_received(message: rtc.ChatMessage):
        if message.message:
            asyncio.create_task(answer_from_text(message.message, use_image=False))
    
    @assistant.on("function_calls_finished")
    def on_function_calls_finished(msg: rtc.ChatMessage):
        """
        This event triggers whenever we get a new message from the user.
        """
        user_msg = ctx.get_metadata("user_msg")
        if user_msg:
            asyncio.create_task(answer_from_text(user_msg, use_image=True))
    minutes = int(exam_duration / second)
    await asyncio.sleep(3)
    
    # Greets the user with an initial message
    await assistant.say(f"Welcome {participant.identity} to the English speaking test. We have {minutes} minutes for this session. Let's begin!", allow_interruptions=False)
    
    while ctx.room.connection_state == rtc.ConnectionState.CONN_CONNECTED:
        video_track = await get_video_track(ctx.room)
        async for event in rtc.VideoStream(video_track):
            # We'll continually grab the latest image from the video track
            # and store it in a variable.
            lastest_image = event.frame
    await asyncio.sleep(exam_duration+60)
    #add a shutdown callback to the agent
    ctx.shutdown(reason="test_finished")
    api_client = api.LivekitApi(api_key=os.getenv("LIVEKIT_API_KEY"), api_secret=os.getenv("LIVEKIT_API_SECRET"))
    await api_client.room.delete_room(api.DeleteRoomRequest(ctx.job.room.name))

    

if __name__ == "__main__":
    print("Starting the English speaking test...")
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))