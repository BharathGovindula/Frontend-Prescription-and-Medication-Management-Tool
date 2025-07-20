import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../services/userService';

const initialState = {
  profile: null,
  doctors: [],
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, thunkAPI) => {
  try {
    return await userService.fetchProfile();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (profile, thunkAPI) => {
  try {
    return await userService.updateProfile(profile);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchDoctors = createAsyncThunk('user/fetchDoctors', async (_, thunkAPI) => {
  try {
    return await userService.fetchDoctors();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateDoctors = createAsyncThunk('user/updateDoctors', async (doctors, thunkAPI) => {
  try {
    return await userService.updateDoctors(doctors);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(updateDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      });
  },
});

export const selectUserProfile = (state) => state.user.profile;
export const selectDoctors = (state) => state.user.doctors;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer; 