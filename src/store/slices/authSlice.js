"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return rejectWithValue(error.message || "Misslyckad inloggning.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Misslyckad inloggning.");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await fetch("/api/auth/login", {
    method: "DELETE",
    credentials: "include",
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Misslyckad inloggning.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthenticated } = authSlice.actions;

export default authSlice.reducer;
