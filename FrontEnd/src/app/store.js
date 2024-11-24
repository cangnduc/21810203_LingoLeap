import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./features/appSlice";
import authReducer from "./features/authSlice";
import testAnswerReducer from "./features/testAnswerSlice";
import { combineReducers } from "redux";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { chatApi } from "./services/chatApi";
import { questionApi } from "./services/questionApi";
import { testApi } from "./services/testApi";
import { reviewApi } from "./services/reviewApi";
import { testAttemptApi } from "./services/testAttemptApi";
import { testResultApi } from "./services/testResultApi";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "app", "testAnswer"],
};

const uploadProgressReducer = (state = 0, action) => {
  if (action.type === "uploadProgress") {
    return action.payload;
  }
  return state;
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  uploadProgress: uploadProgressReducer,
  testAnswer: testAnswerReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer,
  [testApi.reducerPath]: testApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [testAttemptApi.reducerPath]: testAttemptApi.reducer,
  [testResultApi.reducerPath]: testResultApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      userApi.middleware,
      chatApi.middleware,
      questionApi.middleware,
      testApi.middleware,
      reviewApi.middleware,
      testAttemptApi.middleware,
      testResultApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});
export const persistor = persistStore(store);
