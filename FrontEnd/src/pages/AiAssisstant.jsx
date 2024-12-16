import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

export default function AiAssisstant({
  token,
  url,
  onTokenChange,
  onUrlChange,
}) {
  console.log("token", token);
  console.log("url", url);
  return (
    <div>
      <LiveKitRoom
        className="mt-3"
        video={true}
        audio={true}
        token={token}
        serverUrl={url}
        data-lk-theme="default"
        connect={true}
        style={{ height: "40vh" }}
        onConnected={() => {
          console.log("Connected to the room");
        }}
        onDisconnected={() => {
          onTokenChange(null);
          onUrlChange(null);
          console.log("Disconnected from the room");
        }}
      >
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
const ActiveRoom = () => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  return (
    <>
      <RoomAudioRenderer />
      <button
        onClick={() => {
          localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled);
        }}
      >
        Toggle Microphone
      </button>
      <div>Audio Enabled: {isMicrophoneEnabled ? "Unmuted" : "Muted"}</div>
    </>
  );
};
