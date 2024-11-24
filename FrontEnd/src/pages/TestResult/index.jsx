import React from "react";
import { useGetTestResultQuery } from "@/app/services/testResultApi";
import Loader from "@/components/Loader";
import { useParams } from "react-router-dom";
import TestResultPage from "@/pages/testResult/TestResultPage";

const TestResult = () => {
  const { attemptId } = useParams();
  const {
    data: response,
    isLoading,
    isError,
  } = useGetTestResultQuery(attemptId);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading test result</div>;
  if (!response?.testResult) return <div>No test result found</div>;

  return <TestResultPage testResult={response.testResult} />;
};

export default TestResult;
