import { PayloadAction, ThunkAction, UnknownAction, createSlice } from '@reduxjs/toolkit';
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
    addNotification: (state, action: PayloadAction<Notification>) => {
      const notification = action.payload;
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<Notification["id"]>) => {
      const id = action.payload;
      state.notifications = state.notifications
        .filter((notification) => notification.id !== id);
    },  
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

// SELECTORS

export const selectNotifications = (state: RootState) => state.notifications.notifications;

// THUNKS 

// must be a thunk: contains a side-effect (generating random value)
export const createNotification = (values: Omit<Notification, 'id'>): ThunkAction<
  void,
  RootState,
  unknown,
  UnknownAction
> => (dispatch) => {
  // Create a version 4 (random) UUID
  const id = uuidv4();
  const notification: Notification = { id, ...values };

  dispatch(addNotification(notification));
};
