import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useDebounce } from "@/hooks/useDebounce";
import {
  useSaveAnswerMutation,
  useInitializeTestAttemptQuery,
  useCompleteTestAttemptMutation,
} from "@/app/services/testAttemptApi";
import {
  setTestAnswer,
  clearTestAnswers,
  selectAnswers,
} from "@/app/features/testAnswerSlice";
import TestHeader from "./TestHeader";
import SectionNavigation from "./SectionNavigation";
import PassageDisplay from "./PassageDisplay";
import QuestionDisplay from "./QuestionDisplay";
import TestTimer from "./TestTimer";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
const TestAttempt = () => {
  const { testAttemptId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const answers = useSelector(selectAnswers);
  //console.log("answers", answers);
  const [
    completeTestAttempt,
    { isLoading: isCompleting, error: completeError },
  ] = useCompleteTestAttemptMutation();
  const {
    data: testAttemptData,
    isLoading: isAttemptLoading,
    error: attemptError,
    refetch,
  } = useInitializeTestAttemptQuery(testAttemptId, {
    refetchOnMountOrArgChange: true,
  });
  //console.log("testAttemptData", testAttemptData);
  const { test, testAttempt: savedAttempt } = testAttemptData || {};
  console.log("savedAttempt", savedAttempt);

  const [saveAnswer, { isLoading: isSaving }] = useSaveAnswerMutation();
  // Handle error and navigation
  useEffect(() => {
    if (attemptError) {
      dispatch(clearTestAnswers());
      toast.error(attemptError.data?.errors || "Failed to load test attempt");
      console.log("attemptError", attemptError);
    }
    if (completeError) {
      toast.error(completeError.data?.errors || "Failed to complete test");
    }
  }, [attemptError, navigate, completeError]);

  const handleTimeUp = async () => {
    try {
      await completeTestAttempt(savedAttempt._id).unwrap();
      dispatch(clearTestAnswers());
      toast.success("Test completed successfully");
      navigate("/tests");
    } catch (error) {
      toast.error(error.data?.message || "Failed to complete test");
    }
  };

  useEffect(() => {
    if (savedAttempt?.answers && !isAttemptLoading) {
      // Clear existing answers first
      //dispatch(clearTestAnswers());

      // Add each answer from savedAttempt, ensuring both question and answer exist
      savedAttempt.answers.forEach(({ question, userAnswer }) => {
        if (question && userAnswer !== undefined) {
          dispatch(
            setTestAnswer({
              questionId: question,
              answer: userAnswer,
            })
          );
        }
      });
    }
  }, [savedAttempt, isAttemptLoading, dispatch]);

  const handleAnswerChange = useCallback(
    (questionId, answer) => {
      if (questionId && answer !== undefined) {
        dispatch(
          setTestAnswer({
            questionId,
            answer,
          })
        );
      }
    },

    [dispatch]
  );

  // Memoize getCurrentAnswer
  const getCurrentAnswer = useCallback(
    (questionId) => {
      const answerObj = answers.find(
        (ans) => ans.question === questionId && ans.answer !== undefined
      );
      return answerObj?.answer;
    },
    [answers]
  );

  // Memoize the save to server effect
  const saveToServer = useCallback(async () => {
    if (answers.length > 0) {
      try {
        await saveAnswer({
          testAttemptId: savedAttempt._id,
          answers: answers,
        }).unwrap();
      } catch (error) {
        toast.error("Failed to save answers");
      }
    }
  }, [answers, savedAttempt?._id, saveAnswer]);

  // Update the effect to use the memoized callback
  useEffect(() => {
    const timeoutId = setTimeout(saveToServer, 15000);
    return () => clearTimeout(timeoutId);
  }, [saveToServer]);

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers]);

  const handleTestComplete = async () => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        "Are you sure you want to submit the test? This action cannot be undone."
      );

      if (!confirmed) {
        return;
      }
      await saveAnswer({
        testAttemptId: savedAttempt._id,
        answers: answers,
      }).unwrap();
      await completeTestAttempt(savedAttempt._id).unwrap();
      dispatch(clearTestAnswers());
      toast.success("Test completed successfully");
      navigate("/tests");
    } catch (error) {
      toast.error(error.data?.message || "Failed to complete test");
    }
  };

  // Force refresh if needed (e.g., after certain actions)
  const handleForceRefresh = () => {
    refetch();
  };

  useEffect(() => {
    // Force refresh in specific scenarios
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Only refresh if the test is in progress
        if (test?.status === "in-progress") {
          refetch();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch, test?.status]);

  const sortSections = (sections) => {
    // Create a copy of sections to avoid mutating the original
    return [...sections].sort((a, b) => {
      // If it's a speaking section, move it to the end
      if (a.name === "speaking") return 1;
      if (b.name === "speaking") return -1;
      return 0;
    });
  };

  if (isAttemptLoading || !testAttemptData) {
    return <div>Loading...</div>;
  }

  if (!test || !savedAttempt) {
    return <div>Test not found or not properly initialized</div>;
  }
  //console.log("test", test);
  return (
    <div className="container mx-auto p-4">
      <TestHeader title={test.title} description={test.description} />
      <TestTimer
        duration={test.duration}
        startTime={savedAttempt.startTime}
        onTimeUp={handleTimeUp}
      />

      <div className="flex justify-end mb-4">
        {isSaving || isCompleting ? (
          <div className="w-8 h-8">
            <Loader />
          </div>
        ) : (
          <button
            onClick={handleTestComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Test
          </button>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 mb-4 lg:mb-0">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <SectionNavigation sections={test.sections || []} />
          </div>
        </div>

        <div className="lg:col-span-9">
          {sortSections(test.sections || []).map((section, index) => (
            <div
              key={section._id}
              id={`section-${section._id}`}
              className="scroll-mt-24"
            >
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
                {section.name.charAt(0).toUpperCase() + section.name.slice(1)}{" "}
                Section
              </h2>
              <p className="mb-4">{section.instruction}</p>

              {/* For reading/listening sections with passages */}
              {(section.name === "reading" || section.name === "listening") &&
                section.passages?.map((passage, index) => (
                  <div key={passage._id?._id || passage._id || index}>
                    <PassageDisplay passage={passage._id} index={index} />
                    {passage._id?.questions?.map((question, index) => (
                      <QuestionDisplay
                        key={question._id?._id || question._id || index}
                        question={question}
                        onAnswerChange={(answer) =>
                          handleAnswerChange(question._id, answer)
                        }
                        currentAnswer={getCurrentAnswer(question._id)}
                        index={index}
                      />
                    ))}
                  </div>
                ))}

              {/* For sections without passages */}
              {!section.passages &&
                section.questions?.map((question, index) => {
                  return (
                    <QuestionDisplay
                      key={question._id?._id || question._id || index}
                      question={question._id}
                      onAnswerChange={(answer) =>
                        handleAnswerChange(
                          question._id?._id || question._id,
                          answer
                        )
                      }
                      currentAnswer={getCurrentAnswer(
                        question._id?._id || question._id
                      )}
                      index={index}
                      duration={section.duration}
                      testAttemptId={savedAttempt._id}
                    />
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {isSaving && <div className="text-sm text-gray-500">Saving...</div>}
    </div>
  );
};

export default TestAttempt;
