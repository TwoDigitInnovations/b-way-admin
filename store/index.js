import { configureStore } from '@reduxjs/toolkit';
import routeReducer from './routeSlice';
import driverReducer from './driverSlice';
import itemReducer from './itemSlice';
import userReducer from './userList';
import hospitalReducer from './hospitalSlice';

export const store = configureStore({
  reducer: {
    route: routeReducer,
    driver: driverReducer,
    item: itemReducer,
    user: userReducer,
    hospital: hospitalReducer
  }
});
