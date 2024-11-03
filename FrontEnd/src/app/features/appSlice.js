import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isDarkMode: false,
    isAttemptTest: false,
    menu: {
      isOpen: false,
      height: 0,
      isClosing: false,
    }, // Add this line
  },
  reducers: {
    setMenuHeight: (state, action) => {
      state.menu.height = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      if (action.payload == false && state.menu.isOpen) {
        state.menu.isClosing = true;
      } else {
        state.menu.isOpen = action.payload;
        state.menu.isClosing = false;
      }
    },
    finishClosingMenu: (state) => {
      state.menu.isOpen = false;
      state.menu.isClosing = false;
      state.menu.height = 0;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setIsAttemptTest: (state, action) => {
      state.isAttemptTest = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setIsMenuOpen,
  setMenuHeight,
  finishClosingMenu,
  setIsAttemptTest,
} = appSlice.actions;
export default appSlice.reducer;
