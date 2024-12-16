import { useParams } from "react-router-dom";
import BaseQuestion from "@/pages/AddQuestion/BaseQuestion";
import { useGetMyQuestionByIdQuery } from "@/app/services/questionApi";
import Loader from "@/components/loader";

function EditQuestion() {
  const { id } = useParams();
  const { data: questionData, isLoading } = useGetMyQuestionByIdQuery(id);
  if (isLoading) {
    return <Loader />;
  }
  console.log(questionData);
  if (!questionData) {
    return <div>Question not found</div>;
  }

  return (
    <div className="px-7 py-4">
      <BaseQuestion mode="edit" initialData={questionData} />
    </div>
  );
}

export default EditQuestion;
