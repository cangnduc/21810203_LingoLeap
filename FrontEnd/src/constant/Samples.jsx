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

  // Remove FaPenClip
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
  { name: "A1", label: "A1" },
  { name: "A2", label: "A2" },
  { name: "B1", label: "B1" },
  { name: "B2", label: "B2" },
  { name: "C1", label: "C1" },
  { name: "C2", label: "C2" },
];
export { sectionList, typeList, sectionToTypeMap, difficultyList };
