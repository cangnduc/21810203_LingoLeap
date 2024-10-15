import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
//import { QuestionSchema } from "./zodSchemas"; // Import the Zod schema we created earlier
import {
  FaRegDotCircle,
  FaRegCheckSquare,
  FaICursor,
  FaToggleOn,
  FaFileAlt,
  FaRegCommentDots,
} from "react-icons/fa";
const QuestionForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      section: "",
      questionText: "",
      instruction: "",
      difficulty: 1,
      isPublic: true,
    },
  });

  const questionType = watch("type");
  const section = watch("section");

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the data to your backend
  };
  const typeList = [
    {
      icon: <FaRegDotCircle />,
      name: "single_choice",
      belongTo: ["reading", "listening", "general"],
    },
    {
      icon: <FaRegCheckSquare />,
      name: "multiple_choice",
      belongTo: ["reading", "listening", "general"],
    },
    {
      icon: <FaICursor />,
      name: "fill_in_the_blank",
      belongTo: ["reading", "listening", "general"],
    },
    {
      icon: <FaToggleOn />,
      name: "true_false",
      belongTo: ["reading", "listening", "general"],
    },
    {
      icon: <FaRegCommentDots />,
      name: "open_ended",
      belongTo: ["speaking"],
    },
    { icon: <FaFileAlt />, name: "essay", belongTo: ["writing"] },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="">Select Question Type</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="single_choice">Single Choice</option>
            <option value="fill_in_the_blank">Fill in the Blank</option>
            <option value="matching">Matching</option>
            <option value="true_false">True/False</option>
            <option value="open_ended">Open Ended</option>
            <option value="essay">Essay</option>
            <option value="ordering">Ordering</option>
          </select>
        )}
      />
      {errors.type && <p>{errors.type.message}</p>}

      <Controller
        name="section"
        control={control}
        render={({ field }) => (
          <select {...field}>
            <option value="">Select Section</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="speaking">Speaking</option>
            <option value="writing">Writing</option>
            <option value="general">General</option>
          </select>
        )}
      />
      {errors.section && <p>{errors.section.message}</p>}

      <Controller
        name="questionText"
        control={control}
        render={({ field }) => <input {...field} placeholder="Question Text" />}
      />
      {errors.questionText && <p>{errors.questionText.message}</p>}

      <Controller
        name="instruction"
        control={control}
        render={({ field }) => <input {...field} placeholder="Instruction" />}
      />
      {errors.instruction && <p>{errors.instruction.message}</p>}

      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => (
          <input {...field} type="number" min="1" max="5" />
        )}
      />
      {errors.difficulty && <p>{errors.difficulty.message}</p>}

      <Controller
        name="isPublic"
        control={control}
        render={({ field }) => <input {...field} type="checkbox" />}
      />

      {questionType === "multiple_choice" && (
        <MultipleChoiceFields control={control} errors={errors} />
      )}

      {questionType === "single_choice" && (
        <SingleChoiceFields control={control} errors={errors} />
      )}

      {/* Add conditional rendering for other question types here */}

      {section === "reading" && (
        <ReadingPassageField control={control} errors={errors} />
      )}

      {section === "listening" && (
        <ListeningPassageField control={control} errors={errors} />
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

const MultipleChoiceFields = ({ control, errors }) => (
  <>
    <Controller
      name="answers"
      control={control}
      render={({ field }) => (
        <input {...field} placeholder="Answers (comma-separated)" />
      )}
    />
    {errors.answers && <p>{errors.answers.message}</p>}

    <Controller
      name="correctAnswers"
      control={control}
      render={({ field }) => (
        <input {...field} placeholder="Correct Answers (comma-separated)" />
      )}
    />
    {errors.correctAnswers && <p>{errors.correctAnswers.message}</p>}
  </>
);

const SingleChoiceFields = ({ control, errors }) => (
  <>
    <Controller
      name="answers"
      control={control}
      render={({ field }) => (
        <input {...field} placeholder="Answers (comma-separated)" />
      )}
    />
    {errors.answers && <p>{errors.answers.message}</p>}

    <Controller
      name="correctAnswer"
      control={control}
      render={({ field }) => <input {...field} placeholder="Correct Answer" />}
    />
    {errors.correctAnswer && <p>{errors.correctAnswer.message}</p>}
  </>
);

const ReadingPassageField = ({ control, errors }) => (
  <>
    <Controller
      name="readingPassage"
      control={control}
      render={({ field }) => (
        <select {...field}>
          <option value="">Select Reading Passage</option>
          {/* You would typically fetch these options from your backend */}
          <option value="passage1">Passage 1</option>
          <option value="passage2">Passage 2</option>
        </select>
      )}
    />
    {errors.readingPassage && <p>{errors.readingPassage.message}</p>}
  </>
);

const ListeningPassageField = ({ control, errors }) => (
  <>
    <Controller
      name="listeningPassage"
      control={control}
      render={({ field }) => (
        <select {...field}>
          <option value="">Select Listening Passage</option>
          {/* You would typically fetch these options from your backend */}
          <option value="audio1">Audio 1</option>
          <option value="audio2">Audio 2</option>
        </select>
      )}
    />
    {errors.listeningPassage && <p>{errors.listeningPassage.message}</p>}
  </>
);

export default QuestionForm;
