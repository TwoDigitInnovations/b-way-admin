import { Api } from "@/helper/service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDrivers = createAsyncThunk(
  "driver/fetchDrivers",
  async () => {
    const response = await Api("GET", "/driver", null, null);
    return response.data;
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState: {
    drivers: [],
    assignedDriver: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAssignedDriver: (state, action) => {
      state.assignedRoute = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload || [];
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setAssignedDriver } = driverSlice.actions;
export default driverSlice.reducer;
