"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  fetchStatus: "idle",
  fetchError: null,
  submitStatus: "idle",
  submitError: null,
  submitMessage: null,
};

export const submitSubscriber = createAsyncThunk(
  "subscribers/submit",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(data.message || "Kunde inte spara e-postadressen.");
      }

      return data;
    } catch (error) {
      return rejectWithValue("Kunde inte spara e-postadressen.");
    }
  }
);

export const fetchSubscribers = createAsyncThunk(
  "subscribers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/subscribers", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(data.message || "Kunde inte hämta listan.");
      }

      return data.subscribers || [];
    } catch (error) {
      return rejectWithValue("Kunde inte hämta listan.");
    }
  }
);

const subscriberSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {
    resetSubmitState(state) {
      state.submitStatus = "idle";
      state.submitError = null;
      state.submitMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSubscriber.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
        state.submitMessage = null;
      })
      .addCase(submitSubscriber.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.submitMessage = action.payload?.message || "Tack!";
      })
      .addCase(submitSubscriber.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload || "Kunde inte spara e-postadressen.";
      })
      .addCase(fetchSubscribers.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload || "Kunde inte hämta listan.";
      });
  },
});

export const { resetSubmitState } = subscriberSlice.actions;

export default subscriberSlice.reducer;
