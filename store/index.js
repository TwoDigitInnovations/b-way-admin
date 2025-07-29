import { configureStore } from '@reduxjs/toolkit';
import routeReducer from './routeSlice';
import driverReducer from './driverSlice';

export const store = configureStore({
  reducer: {
    route: routeReducer,
    driver: driverReducer,
  }
});
