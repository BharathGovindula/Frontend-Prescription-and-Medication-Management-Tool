import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as analyticsService from '../services/analyticsService';

const initialState = {
  trends: null,
  aiAdherence: null,
  predictiveReminders: null,
  suggestions: [],
  smartSchedule: null,
  loading: false,
  error: null,
};

export const fetchTrends = createAsyncThunk('analytics/fetchTrends', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchTrends();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchAIAdherence = createAsyncThunk('analytics/fetchAIAdherence', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchAIAdherence();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchPredictiveReminders = createAsyncThunk('analytics/fetchPredictiveReminders', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchPredictiveReminders();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchSuggestions = createAsyncThunk('analytics/fetchSuggestions', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchSuggestions();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchSmartSchedule = createAsyncThunk('analytics/fetchSmartSchedule', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchSmartSchedule();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAIAdherence.fulfilled, (state, action) => {
        state.aiAdherence = action.payload;
      })
      .addCase(fetchPredictiveReminders.fulfilled, (state, action) => {
        state.predictiveReminders = action.payload;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSmartSchedule.fulfilled, (state, action) => {
        state.smartSchedule = action.payload;
      });
  },
});

export const selectTrends = (state) => state.analytics.trends;
export const selectAIAdherence = (state) => state.analytics.aiAdherence;
export const selectPredictiveReminders = (state) => state.analytics.predictiveReminders;
export const selectSuggestions = (state) => state.analytics.suggestions;
export const selectSmartSchedule = (state) => state.analytics.smartSchedule;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;

export default analyticsSlice.reducer; 