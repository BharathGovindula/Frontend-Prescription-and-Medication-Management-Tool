import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reminderService from '../services/reminderService';

const initialState = {
  reminders: [],
  loading: false,
  error: null,
};

export const fetchReminders = createAsyncThunk('reminders/fetchAll', async (_, thunkAPI) => {
  try {
    return await reminderService.fetchReminders();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateReminderStatus = createAsyncThunk('reminders/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    return await reminderService.updateReminderStatus(id, status);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReminderStatus.fulfilled, (state, action) => {
        const idx = state.reminders.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.reminders[idx] = action.payload;
      });
  },
});

export const selectReminders = (state) => state.reminders.reminders;
export const selectRemindersLoading = (state) => state.reminders.loading;
export const selectRemindersError = (state) => state.reminders.error;

export default remindersSlice.reducer; 