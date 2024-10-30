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
  { name: "reading", label: "Reading", icon: <FaBook /> },
  { name: "listening", label: "Listening", icon: <FaHeadphones /> },
  { name: "speaking", label: "Speaking", icon: <FaMicrophone /> },
  { name: "writing", label: "Writing", icon: <FaPen /> },
  { name: "general", label: "General", icon: <FaBookOpen /> },
  { name: "vocabulary", label: "Vocabulary", icon: <FaFont /> },
  { name: "grammar", label: "Grammar", icon: <FaPuzzlePiece /> },
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
  speaking: ["open_ended", "essay"],
  writing: ["essay", "open_ended"],
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
  { name: "beginner", label: "Beginner" },
  { name: "elementary", label: "Elementary" },
  { name: "intermediate", label: "Intermediate" },
  { name: "upper_intermediate", label: "Upper Intermediate" },
  { name: "advanced", label: "Advanced" },
  { name: "expert", label: "Expert" },
  { name: "master", label: "Master" },
];
const testTypeList = [
  { name: "ielts", label: "IELTS" },
  { name: "toefl", label: "TOEFL" },
  { name: "toeic", label: "TOEIC" },
  { name: "cambridge", label: "Cambridge English" },
  { name: "pte", label: "PTE Academic" },
  { name: "vstep", label: "VSTEP" },
  { name: "vnu_ept", label: "VNU-EPT" },
  { name: "toefl_itp", label: "TOEFL ITP" },
  { name: "ielts_life_skills", label: "IELTS Life Skills" },
  { name: "a1", label: "A1" },
  { name: "a2", label: "A2" },
  { name: "b1", label: "B1" },
  { name: "b2", label: "B2" },
  { name: "c1", label: "C1" },
  { name: "c2", label: "C2" },
];
export {
  sectionList,
  typeList,
  sectionToTypeMap,
  difficultyList,
  testTypeList,
};
