"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import subscriberReducer from "./slices/subscriberSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      subscribers: subscriberReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export const store = makeStore();
