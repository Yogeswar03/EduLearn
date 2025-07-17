import { createContext } from "react";

export const SelectedCourseIndexContext = createContext({
  selectedCourseIndex: 0,
  setSelectedCourseIndex: () => {}, 
});
