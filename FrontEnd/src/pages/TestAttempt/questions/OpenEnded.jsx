import React, { useState } from "react";
import { useGetChatMutation } from "@/app/services/chatApi";
import Loader from "@/components/Loader";
import AiAssisstant from "@/pages/AiAssisstant";
const OpenEnded = ({ question, duration, testAttemptId, onAnswerChange }) => {
  const [getChat, { isLoading: isLoadingGetChat, error: errorGetChat }] =
    useGetChatMutation();
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(null);
  const handleTokenChange = (token) => {
    setToken(token);
  };
  const handleUrlChange = (url) => {
    setUrl(url);
  };
  console.log("token", token);
  console.log("url", url);
  return (
    <div className="space-y-4">
      <div className="font-medium">Topic: {question.questionText}</div>
      {duration && (
        <div className="text-sm text-gray-600">
          Time Limit: {duration} minutes
        </div>
      )}
      <button
        onClick={async () => {
          const response = await getChat({
            question: question.questionText,
            duration: duration,
            testAttemptId: testAttemptId,
          });
          onAnswerChange(null);
          console.log("response", response);
          if (response.data) {
            setToken(response.data.token);
            setUrl(response.data.url);
          }
        }}
        disabled={isLoadingGetChat}
      >
        Start
      </button>
      {token && url && (
        <AiAssisstant
          token={token}
          url={url}
          onTokenChange={handleTokenChange}
          onUrlChange={handleUrlChange}
        />
      )}
      {isLoadingGetChat && <Loader />}
      {errorGetChat && <div>Error: {errorGetChat.message}</div>}
    </div>
  );
};

export default OpenEnded;
