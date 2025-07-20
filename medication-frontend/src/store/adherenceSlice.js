import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as analyticsService from '../services/analyticsService';

const initialState = {
  stats: null,
  streaks: [],
  badges: [],
  loading: false,
  error: null,
};

export const fetchAdherenceStats = createAsyncThunk('adherence/fetchStats', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchAdherenceStats();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchStreaks = createAsyncThunk('adherence/fetchStreaks', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchStreaks();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchBadges = createAsyncThunk('adherence/fetchBadges', async (_, thunkAPI) => {
  try {
    return await analyticsService.fetchBadges();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const adherenceSlice = createSlice({
  name: 'adherence',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdherenceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdherenceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdherenceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStreaks.fulfilled, (state, action) => {
        state.streaks = action.payload;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
      });
  },
});

export const selectAdherenceStats = (state) => state.adherence.stats;
export const selectStreaks = (state) => state.adherence.streaks;
export const selectBadges = (state) => state.adherence.badges;
export const selectAdherenceLoading = (state) => state.adherence.loading;
export const selectAdherenceError = (state) => state.adherence.error;

export default adherenceSlice.reducer; 