import React from "react";
import ChoiceFields from "./ChoiceFields";
import TrueFalseFields from "./TrueFalseFields";
import FillInTheBlankFields from "./FillInTheBlankFields";
import MatchingFields from "./MatchingFields";
import OrderingFields from "./OrderingFields";
import OpenEndedFields from "./OpenEndedFields";
import EssayFields from "./EssayFields";
import { motion } from "framer-motion";

export default function QuestionTypeFields({
  type,
  register,
  errors,
  prefix,
  control, // Add this line
}) {
  switch (type) {
    case "multiple_choice":
    case "single_choice":
      return (
        <ChoiceFields
          type={type}
          register={register}
          errors={errors}
          prefix={prefix}
        />
      );
    case "true_false":
      return (
        <TrueFalseFields register={register} errors={errors} prefix={prefix} />
      );
    case "fill_in_the_blank":
      return (
        <FillInTheBlankFields
          register={register}
          errors={errors}
          prefix={prefix}
          control={control}
        />
      );
    case "matching":
      return (
        <MatchingFields register={register} errors={errors} prefix={prefix} />
      );
    case "ordering":
      return (
        <OrderingFields
          register={register}
          errors={errors}
          prefix={prefix}
          control={control} // Add this line
        />
      );
    case "open_ended":
      return (
        <OpenEndedFields register={register} errors={errors} prefix={prefix} />
      );
    case "essay":
      return (
        <EssayFields register={register} errors={errors} prefix={prefix} />
      );
    default:
      return null;
  }
}
