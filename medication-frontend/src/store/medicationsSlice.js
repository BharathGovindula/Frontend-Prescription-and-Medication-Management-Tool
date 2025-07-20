import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as medicationService from '../services/medicationService';

const initialState = {
  medications: [],
  logs: {},
  loading: false,
  error: null,
};

export const fetchMedications = createAsyncThunk('medications/fetchAll', async (_, thunkAPI) => {
  try {
    return await medicationService.fetchMedications();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addMedication = createAsyncThunk('medications/add', async (medication, thunkAPI) => {
  try {
    return await medicationService.addMedication(medication);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateMedication = createAsyncThunk('medications/update', async ({ id, updates }, thunkAPI) => {
  try {
    return await medicationService.updateMedication(id, updates);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteMedication = createAsyncThunk('medications/delete', async (id, thunkAPI) => {
  try {
    await medicationService.deleteMedication(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchLogs = createAsyncThunk('medications/fetchLogs', async (medId, thunkAPI) => {
  try {
    return { medId, logs: await medicationService.fetchLogs(medId) };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.loading = false;
        state.medications = action.payload;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.medications.push(action.payload);
      })
      .addCase(updateMedication.fulfilled, (state, action) => {
        const idx = state.medications.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.medications[idx] = action.payload;
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.medications = state.medications.filter(m => m._id !== action.payload);
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logs[action.payload.medId] = action.payload.logs;
      });
  },
});

export const selectMedications = (state) => state.medications.medications;
export const selectMedicationLogs = (state, medId) => state.medications.logs[medId] || [];
export const selectMedicationsLoading = (state) => state.medications.loading;
export const selectMedicationsError = (state) => state.medications.error;

export default medicationsSlice.reducer; 