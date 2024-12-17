import {
  FaHome,
  FaClipboardCheck,
  FaBook,
  FaGamepad,
  FaSignInAlt,
  FaUserPlus,
  FaQuestion,
  FaPen,
} from "react-icons/fa";
import { RiSpeakFill } from "react-icons/ri";
export const APP_NAME = "LingoLeap";
export const BACKEND_URL = "https://192.168.1.10:3000";
export const maxQuestionsPerSection = 200;
export const siteLinks = {
  "/": FaHome,
  "/tests": FaClipboardCheck,
  "/courses": FaBook,
  "/question": FaQuestion,
  "/game": FaGamepad,
  "/chat": RiSpeakFill,
  "/login": FaSignInAlt,
  "/register": FaUserPlus,
  "/test-creation": FaPen,
};
export const testTypes = [
  "ielts",
  "toefl",
  "toeic",
  "cambridge",
  "pte",
  "vstep",
  "vnu_ept",
  "toefl_itp",
  "ielts_life_skills",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
];
export const difficultyLevels = [
  { value: "beginner", label: "Beginner", color: "bg-green-300" },
  { value: "elementary", label: "Elementary", color: "bg-green-500" },
  { value: "intermediate", label: "Intermediate", color: "bg-yellow-400" },
  {
    value: "upper_intermediate",
    label: "Upper Intermediate",
    color: "bg-yellow-600",
  },
  { value: "advanced", label: "Advanced", color: "bg-orange-500" },
  { value: "expert", label: "Expert", color: "bg-red-500" },
  { value: "master", label: "Master", color: "bg-red-700" },
];
export const testOrderOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "totalAttempts", label: "Total Attempts" },
  { value: "title", label: "Title" },
];
