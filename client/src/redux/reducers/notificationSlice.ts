import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '../../types';
import { RootState } from '../store';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
};

export interface NotificationState {
  notifications: Notification[],
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification = action.payload;
      state.notifications.push({
        ...notification,
        id: uuidv4(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.notifications = state.notifications
        .filter((notification) => notification.id !== id);
    },  
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.notifications;

export default notificationSlice.reducer;
