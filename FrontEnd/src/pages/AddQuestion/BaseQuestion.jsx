import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { SectionBasedValidator } from "@/validator/question.validator";
import { sectionList, sectionToTypeMap } from "@/constant/Samples";
import PassageForm from "./PassageForm";
import BaseQuestionForm from "./BaseQuestionForm";
import { useNavigate } from "react-router-dom";
import {
  useAddQuestionMutation,
  useEditQuestionMutation,
} from "@/app/services/questionApi";
import { toast } from "react-toastify";

export default function BaseQuestion({ mode = "add", initialData = null }) {
  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const [editQuestion, { isLoading: isEditLoading }] =
    useEditQuestionMutation();

  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    trigger,
    clearErrors,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(SectionBasedValidator),
    mode: "onChange",
    defaultValues: initialData
      ? {
          section: initialData.section || "reading",
          type: initialData.type || "single_choice",
          data:
            initialData.section === "reading" ||
            initialData.section === "listening"
              ? {
                  passage: {
                    passageType: initialData.section,
                    title: initialData.title || "",
                    text: initialData.text || "",
                    url: initialData.url || "",
                    ...(initialData.section === "listening"
                      ? { audioUrl: initialData.audioUrl || "" }
                      : {}),
                  },
                  questions: [
                    {
                      type: initialData.type,
                      ...initialData,
                    },
                  ],
                }
              : {
                  question: {
                    type: initialData.type,
                    ...initialData,
                  },
                },
        }
      : {
          section: "reading",
          type: "single_choice",
          data: {
            passage: {
              passageType: "reading",
              title: "",
              text: "",
              url: "",
            },
            questions: [
              {
                type: "single_choice",
                questionText: "",
                instruction: "",
                difficulty: 1,
                answers: ["", "", "", ""],
                correctAnswer: "",
                section: "reading",
              },
            ],
          },
        },
  });
  const section = watch("section");
  const questionsData = watch("data.questions") || [];

  const singleQuestionData = watch("data.question");
  const setQuestions = () =>
    section === "reading" || section === "listening"
      ? [{ id: Date.now() }]
      : [];

  useEffect(() => {}, [errors, isValid]);

  useEffect(() => {
    if (mode === "edit") {
      return;
    }

    const newDefaultValues = {
      section: section,
      type: sectionToTypeMap[section][0],
      data:
        section === "reading" || section === "listening"
          ? {
              passage: {
                passageType: section,
                title: "",
                text: "",
                url: "",
                ...(section === "listening" ? { audioUrl: "" } : {}),
              },
              questions: [
                {
                  type: sectionToTypeMap[section][0],
                  questionText: "",
                  instruction: "",
                  difficulty: 1,
                  answers: ["", "", "", ""],
                  correctAnswer: "",
                },
              ],
            }
          : {
              question: {
                type: sectionToTypeMap[section][0],
                questionText: "",
                instruction: "",
                difficulty: 1,
                answers: ["", "", "", ""],
                correctAnswer: "",
              },
            },
    };

    reset(newDefaultValues);
  }, [section, reset, mode]);

  const resetForm = () => {
    const defaultValues = {
      section: "reading",
      data: {
        passage: {
          passageType: "reading",
          title: "",
          text: "",
          url: "",
        },
        questions: [
          {
            type: "single_choice",
            questionText: "",
            instruction: "",
            difficulty: 1,
            answers: ["", "", "", ""],
            correctAnswer: "",
            section: "reading",
          },
        ],
      },
    };

    reset(defaultValues);
    setAudioPreviewUrl(null);
    setUploadProgress(0);
    clearErrors();

    // Force re-render
    setValue("section", "reading");

    console.log("Form reset. New values:", getValues());

    // Delay the trigger to ensure the form has been reset
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("section", section);

    const processQuestion = (question) => {
      if (question.type === "multiple_choice") {
        const correctAnswers = Object.entries(question.correctAnswers)
          .filter(([_, value]) => value)
          .map(([index, _]) => question.answers[parseInt(index)]);
        console.log("correctAnswers", correctAnswers);

        return {
          ...question,
          correctAnswers,
        };
      }
      return question;
    };

    try {
      if (mode === "edit" && initialData?._id) {
        //print form data
        const questionData = {
          ...data.data.question,
        };

        const result = await editQuestion({
          id: initialData._id,
          data: questionData,
        }).unwrap();

        if (result.data) {
          //redirect to question list
          navigate("/my-questions");
          toast.success("Question updated successfully!");
        }
      } else {
        // Existing add logic
        if (section === "reading" || section === "listening") {
          if (section === "listening") {
            formData.append("soundFile", data.data?.passage?.soundFile);
          }
          const processedQuestions = data.data.questions.map(processQuestion);
          formData.append("questions", JSON.stringify(processedQuestions));
          const { soundFile, ...passage } = data.data.passage;
          formData.append("passage", JSON.stringify(passage));

          setUploadProgress(0);

          const result = await addQuestion(formData).unwrap();
          console.log("Result from addQuestion:", result);

          if (result.error) {
            throw new Error(result.error.message || "Unknown error occurred");
          }

          if (result.data) {
            console.log("Question added successfully. Result:", result.data);
            //resetForm();
            toast.success("Question added successfully!");
          } else {
            console.warn("Unexpected response format:", result);
            toast.warn(
              "Question may have been added, but the response was unexpected."
            );
          }
        } else {
          const processedQuestion = processQuestion(data.data.question);

          formData.append("question", JSON.stringify(processedQuestion));
          const result = await addQuestion(formData).unwrap();
          console.log("Question added successfully. Result:", result);

          resetForm();
          navigate("/question");
          toast.success("Question added successfully!");
        }
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(error.message || `Failed to ${mode} question`);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    reset();
    setQuestions([]);
  };

  const appendQuestion = () => {
    const newQuestion = {
      section: section,
      type: sectionToTypeMap[section][0],
      questionText: "",
      instruction: "",
      difficulty: 1,
      answers: ["", "", "", ""],
      correctAnswer: "",
    };
    setValue("data.questions", [...questionsData, newQuestion]);
  };

  const removeQuestion = (index) => {
    setValue(
      "data.questions",
      questionsData.filter((_, i) => i !== index)
    );
  };

  const setQuestionType = (index, type) => {
    if (section === "reading" || section === "listening") {
      setValue(`data.questions.${index}.type`, type);
    } else {
      setValue(`data.question.type`, type);
    }
  };

  useEffect(() => {
    //set sections to all questions
    updateSection(section);
  }, [section]);
  const updateSection = (newSection) => {
    setValue("section", newSection);

    if (mode === "edit") {
      if (newSection === "reading" || newSection === "listening") {
        const updatedQuestions = questionsData.map((question) => ({
          ...question,
          section: newSection,
        }));
        setValue("data.questions", updatedQuestions);
      } else {
        setValue("data.question", {
          ...singleQuestionData,
          section: newSection,
        });
      }
    } else {
      if (newSection === "reading" || newSection === "listening") {
        const updatedQuestions =
          questionsData.length > 0
            ? questionsData.map((question) => ({
                ...question,
                section: newSection,
                type: sectionToTypeMap[newSection][0],
              }))
            : [
                {
                  ...singleQuestionData,
                  section: newSection,
                  type: sectionToTypeMap[newSection][0],
                },
              ];
        setValue("data.questions", updatedQuestions);
      } else {
        setValue("data.question", {
          ...singleQuestionData,
          section: newSection,
          type: sectionToTypeMap[newSection][0],
        });
      }
    }
  };
  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Section</label>
          <div className="flex flex-wrap gap-2">
            {sectionList.map((s) => (
              <button
                key={s.name}
                type="button"
                disabled={mode === "edit"}
                className={`p-2 rounded-md ${
                  section === s.name
                    ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-300"
                    : mode === "edit"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => {
                  if (mode !== "edit") {
                    setValue("section", s.name);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {s.icon}
                  {s.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Passage (for reading and listening sections) */}
        {(section === "reading" || section === "listening") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2">Passage</h2>
            <PassageForm
              passageType={section}
              register={register}
              errors={errors.data?.passage || {}}
              setValue={setValue}
              audioPreviewUrl={audioPreviewUrl}
              setAudioPreviewUrl={setAudioPreviewUrl}
              uploadProgress={uploadProgress}
              trigger={trigger} // Add this prop
            />
          </motion.div>
        )}

        {/* Questions */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {section === "reading" || section === "listening"
              ? "Questions"
              : "Question"}
          </h2>
          {section === "reading" || section === "listening" ? (
            // Multiple questions for reading and listening
            questionsData.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:shadow-m"
              >
                <h3 className="text-lg font-medium mb-2">
                  Question {index + 1}
                </h3>
                <BaseQuestionForm
                  questionType={question.type}
                  section={section}
                  register={register}
                  errors={errors.data?.questions?.[index] || {}}
                  prefix={`data.questions.${index}`}
                  setQuestionType={(type) => setQuestionType(index, type)}
                  questionTypes={sectionToTypeMap[section]}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                  trigger={trigger}
                  isEditMode={mode === "edit"}
                />
                {questionsData.length > 1 && mode !== "edit" && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove Question
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            // Single question for other sections
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className=""
            >
              <BaseQuestionForm
                questionType={singleQuestionData?.type}
                section={section}
                register={register}
                errors={errors.data?.question || {}}
                prefix="data.question"
                setQuestionType={(type) => setQuestionType(0, type)}
                questionTypes={sectionToTypeMap[section]}
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                trigger={trigger}
                isEditMode={mode === "edit"}
              />
            </motion.div>
          )}
          {(section === "reading" || section === "listening") &&
            mode !== "edit" && (
              <button
                type="button"
                onClick={appendQuestion}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaPlusCircle className="w-5 h-5 mr-2" />
                Add Question
              </button>
            )}
        </div>

        {/* Submit and Reset buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${
              isValid
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500"
            }`}
            disabled={isLoading || !isValid || isEditLoading}
          >
            {mode === "edit" ? "Update" : "Submit"}
          </button>
          {mode !== "edit" && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </>
  );
}
