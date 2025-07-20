import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import medicationsReducer from './medicationsSlice';
import adherenceReducer from './adherenceSlice';
import remindersReducer from './remindersSlice';
import analyticsReducer from './analyticsSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    medications: medicationsReducer,
    adherence: adherenceReducer,
    reminders: remindersReducer,
    analytics: analyticsReducer,
    user: userReducer,
  },
});

export default store; 