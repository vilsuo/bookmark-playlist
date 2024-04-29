import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NotificationType } from '../../types';
import { RootState } from '../store';

type Notification = {
  id: number;
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
    addNotification: (state, action: PayloadAction<Notification>) => {
      const notification = action.payload;
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<Notification['id']>) => {
      const id = action.payload;
      state.notifications = state.notifications
        .filter((notification) => notification.id !== id);
    },  
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.notifications;

export default notificationSlice.reducer;
