import {
  FaBook,
  FaHeadphones,
  FaMicrophone,
  FaPen,
  FaBookOpen,
  FaFont,
  FaPuzzlePiece,
  FaPenSquare,
  FaPenAlt,
  FaPenFancy,
  FaPenNib,
} from "react-icons/fa";
import { GiChoice } from "react-icons/gi";
const sectionList = [
  { name: "reading", label: "Reading", icon: <FaBook />, color: "bg-blue-500" },
  {
    name: "listening",
    label: "Listening",
    icon: <FaHeadphones />,
    color: "bg-green-500",
  },
  {
    name: "speaking",
    label: "Speaking",
    icon: <FaMicrophone />,
    color: "bg-yellow-500",
  },
  {
    name: "writing",
    label: "Writing",
    icon: <FaPen />,
    color: "bg-purple-500",
  },
  {
    name: "general",
    label: "General",
    icon: <FaBookOpen />,
    color: "bg-orange-500",
  },
  {
    name: "vocabulary",
    label: "Vocabulary",
    icon: <FaFont />,
    color: "bg-pink-500",
  },
  {
    name: "grammar",
    label: "Grammar",
    icon: <FaPuzzlePiece />,
    color: "bg-blue-500",
  },
];

const typeList = [
  { name: "multiple_choice", label: "Multiple Choice", icon: <FaPenSquare /> },
  { name: "single_choice", label: "Single Choice", icon: <GiChoice /> },
  { name: "true_false", label: "True/False", icon: <FaFont /> },
  { name: "fill_in_the_blank", label: "Fill in the Blank", icon: <FaPenAlt /> },
  { name: "matching", label: "Matching", icon: <FaPenFancy /> },
  { name: "ordering", label: "Ordering", icon: <FaPenNib /> },
  { name: "open_ended", label: "Open Ended", icon: <FaPen /> }, // Changed to FaPen
  { name: "essay", label: "Essay", icon: <FaPuzzlePiece /> },
];

const sectionToTypeMap = {
  reading: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
    "matching",
  ],
  listening: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
    "matching",
  ],
  speaking: ["open_ended"],
  writing: ["essay"],
  general: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
    "matching",
    "ordering",
  ],
  vocabulary: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "matching",
  ],
  grammar: [
    "single_choice",
    "multiple_choice",
    "fill_in_the_blank",
    "true_false",
    "matching",
  ],
};
const difficultyList = [
  { name: "beginner", label: "Beginner", value: "beginner" },
  { name: "elementary", label: "Elementary", value: "elementary" },
  { name: "intermediate", label: "Intermediate", value: "intermediate" },
  {
    name: "upper_intermediate",
    label: "Upper Intermediate",
    value: "upper_intermediate",
  },
  { name: "advanced", label: "Advanced", value: "advanced" },
  { name: "expert", label: "Expert", value: "expert" },
  { name: "master", label: "Master", value: "master" },
];
const testTypeList = [
  { name: "ielts", label: "IELTS", value: "ielts" },
  { name: "toefl", label: "TOEFL", value: "toefl" },
  { name: "toeic", label: "TOEIC", value: "toeic" },
  { name: "cambridge", label: "Cambridge English", value: "cambridge" },
  { name: "pte", label: "PTE Academic", value: "pte" },
  { name: "vstep", label: "VSTEP", value: "vstep" },
  { name: "vnu_ept", label: "VNU-EPT", value: "vnu_ept" },
  { name: "toefl_itp", label: "TOEFL ITP", value: "toefl_itp" },
  {
    name: "ielts_life_skills",
    label: "IELTS Life Skills",
    value: "ielts_life_skills",
  },
  { name: "a1", label: "A1", value: "a1" },
  { name: "a2", label: "A2", value: "a2" },
  { name: "b1", label: "B1", value: "b1" },
  { name: "b2", label: "B2", value: "b2" },
  { name: "c1", label: "C1", value: "c1" },
  { name: "c2", label: "C2", value: "c2" },
];
export {
  sectionList,
  typeList,
  sectionToTypeMap,
  difficultyList,
  testTypeList,
};
