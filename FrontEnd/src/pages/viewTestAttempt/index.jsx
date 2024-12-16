import React from "react";
import Loader from "@/components/Loader";
import { useGetAllTestAttemptsByUserQuery } from "@/app/services/testAttemptApi";
import DisplayTestAttempt from "./displayTestAttempt";
const ViewTestAttempt = () => {
  const {
    data: testAttempts,
    isLoading,
    isError,
  } = useGetAllTestAttemptsByUserQuery();
  //console.log(testAttempts);
  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading test attempts</div>;
  if (testAttempts && testAttempts.length === 0)
    return <div>No test attempts found</div>;
  return <DisplayTestAttempt testAttempts={testAttempts} />;
};

export default ViewTestAttempt;
