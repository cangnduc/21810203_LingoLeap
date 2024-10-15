import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  Chat,
  AudioVisualizer,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, ConnectionState } from "livekit-client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetChatQuery } from "../app/services/chatApi";
export default function AiAssisstant() {
  const user = useSelector((state) => state.auth.user);
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(null);
  const { data, isLoading, error } = useGetChatQuery();
  //set token and url
  useEffect(() => {
    if (data) {
      console.log(data);
      setToken(data.token);
      setUrl(data.url);
    }
  }, [data]);

  if (!token || !url) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <LiveKitRoom
        className="mt-14"
        video={true}
        audio={true}
        token={token}
        serverUrl={url}
        data-lk-theme="default"
        style={{ height: "100vh" }}
        connect={true}
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
