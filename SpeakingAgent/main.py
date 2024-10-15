import asyncio
import os
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm, stt, tokenize, tts, vad
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.agents.voice_assistant.speech_handle import SpeechHandle
from livekit.agents.voice_assistant.voice_assistant import BeforeLLMCallback 
from livekit.agents.llm import ChatContext, ChatMessage, LLM
from livekit.plugins import deepgram, openai, silero, google
from livekit import rtc
from dotenv import load_dotenv
import json
from typing import Optional
from functx import AssistantFnc

current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join("..", 'Backend', '.env')
print(env_path)
load_dotenv(dotenv_path=env_path)
credentials = json.loads(os.getenv("GOOGLE_CREDENTIALS"))


class EnhancedVoiceAssistant(VoiceAssistant):
    def __init__(self, *, exam_duration: float = 60, ctx: JobContext, **kwargs):
        super().__init__(**kwargs)
        self.exam_duration = exam_duration
        self.exam_timer: Optional[asyncio.Task] = None
        self.conversation = []
        self.ctx = ctx
        self.participant_identity = None
        self.current_speaker = "assistant"
        self.user_name = None

    def _update_current_speaker(self, role: str) -> None:
        self.current_speaker = role
        print(f"Current speaker: {self.current_speaker}")

    def start(
        self, room: rtc.Room, participant: rtc.RemoteParticipant | str | None = None
    ) -> None:
        super().start(room, participant)
        
        if participant:
            self.participant_identity = participant if isinstance(participant, str) else participant.identity
            print(f"Participant joined: {self.participant_identity}")
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
        print(self.conversation[-1])           
         
    async def provide_feedback(self) -> None:
        conversation_text = "\n".join([f"{message['role']}: {message['content']}" for message in self.conversation])
        print("Conversation transcript: " + conversation_text)
        feedback_prompt = (
            f"Speakers transcript: {conversation_text}\n\n"
            "Based on the conversation speakers've had, please provide a score only for user role (out of 100), we have 2 roles, user and assistant, please provide a score for user only"
            "and brief feedback on the user role English speaking performance. "
            "Consider fluency, pronunciation, vocabulary usage, and overall communication skills. "
            "Format your response as follows:\n"
            "Fluency: [numerical score]\n"
            "Pronunciation: [numerical score]\n"
            "Vocabulary: [numerical score]\n"
            "Overall communication: [numerical score]\n"
            "Total score: [mean of Fluency, Pronunciation, Vocabulary, and Overall communication]\n"
            "Feedback: [your feedback]"
        )

        feedback_context = self.chat_ctx.copy()
        feedback_context.messages.append(ChatMessage(role="system", content=feedback_prompt))
        feedback_stream = self.llm.chat(chat_ctx=feedback_context)
        feedback_text = ""
        async for chunk in feedback_stream:
            content = chunk.choices[0].delta.content
            if content:
                feedback_text += content

        # Speak the feedback
        print(feedback_text)
        await asyncio.sleep(2)       
        await self.say("I apologize for interrupting. The test is now over. here is your feedback.", allow_interruptions=False, add_to_chat_ctx=False)
       
        await asyncio.sleep(2)
        await self.say(feedback_text, allow_interruptions=False, add_to_chat_ctx=False)
        await self.say("Room will be closed shortly")
        

       


async def entrypoint(ctx: JobContext):
    # Create an initial chat context with a system prompt
    exam_duration = 60
    fnc_ctx = AssistantFnc()
    async def participant_entrypoint(ctx: JobContext,participant: rtc.RemoteParticipant):
        print(f"Participant joined: {participant.identity}")
        #fetch the participant's name from the database

    ctx.add_participant_entrypoint(participant_entrypoint)

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for a participant to join and get their identity
    participant = await ctx.wait_for_participant()
    initial_ctx = llm.ChatContext().append(
            role="system",
            text=(
                f"You are an English examiner a speaking test for {participant.identity}. Your role is to assess the speaker's "
                "fluency, pronunciation, and communication flow. You will ask questions and engage in "
                "conversation with the speaker based on given topic" 
                "remember to stay focused on the topic. "
                "if the speaker is not speaking, please ask the speaker to speak"
                "Use clear and concise language, but feel free to use a range of vocabulary and structures "
                "appropriate for the test. After the conversation, provide a score and brief feedback on "
                "the speaker's performance. Remember to maintain a professional and encouraging demeanor "
                "throughout the test."
            ),
        )
    assistant = EnhancedVoiceAssistant(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=google.TTS(credentials_info=credentials),
        chat_ctx=initial_ctx,
        exam_duration=exam_duration,  # Set the exam duration to 60 seconds
        ctx=ctx,
        fnc_ctx=fnc_ctx,
    )

    # Start the voice assistant with the room and the participant
    assistant.start(ctx.room, participant)
    chat = rtc.ChatManager(ctx.room)
    async def answer_from_text(text: str):
        chat_ctx = assistant.chat_ctx.copy()
        chat_ctx.append(role="user", text=text)
        stream = assistant.llm.chat(chat_ctx=chat_ctx)
        await assistant.say(stream)

    @chat.on("message_received")
    def on_message_received(message: rtc.ChatMessage):
        if message.message:
            asyncio.create_task(answer_from_text(message.message))
    await asyncio.sleep(1)

    # Greets the user with an initial message
    await assistant.say(f"Welcome {participant.identity} to the English speaking test. We have {exam_duration} seconds for this session. Let's begin!", allow_interruptions=False)
   
    await asyncio.sleep(exam_duration+60)
    #add a shutdown callback to the agent
    ctx.shutdown()
    
    

if __name__ == "__main__":
    print("Starting the English speaking test...")
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))