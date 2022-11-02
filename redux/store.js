import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./slices/notifications";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});
