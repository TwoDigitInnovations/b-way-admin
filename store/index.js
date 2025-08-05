import { configureStore } from '@reduxjs/toolkit';
import routeReducer from './routeSlice';
import driverReducer from './driverSlice';
import itemReducer from './itemSlice';
import userReducer from './userList';

export const store = configureStore({
  reducer: {
    route: routeReducer,
    driver: driverReducer,
    item: itemReducer,
    user: userReducer,
  }
});
