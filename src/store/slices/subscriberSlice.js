"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  fetchStatus: "idle",
  fetchError: null,
  submitStatus: "idle",
  submitError: null,
  submitMessage: null,
  deleteStatus: "idle",
  deleteError: null,
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

export const deleteSubscriber = createAsyncThunk(
  "subscribers/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(data.message || "Kunde inte ta bort e-postadressen.");
      }

      return { id };
    } catch (error) {
      return rejectWithValue("Kunde inte ta bort e-postadressen.");
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
    resetDeleteState(state) {
      state.deleteStatus = "idle";
      state.deleteError = null;
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
      })
      .addCase(deleteSubscriber.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteSubscriber.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      })
      .addCase(deleteSubscriber.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Kunde inte ta bort e-postadressen.";
      });
  },
});

export const { resetSubmitState, resetDeleteState } = subscriberSlice.actions;

export default subscriberSlice.reducer;
