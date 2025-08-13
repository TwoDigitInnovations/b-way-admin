import { Api } from "@/helper/service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHospital = createAsyncThunk(
  "hospital/fetchHospital",
  async () => {
    const response = await Api("GET", "/auth/HOSPITAL", null, null);
    return response.data;
  }
);

const hospitalSlice = createSlice({
  name: "driver",
  initialState: {
    hospitals: [],
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
      .addCase(fetchHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload || [];
      })
      .addCase(fetchHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setAssignedDriver } = hospitalSlice.actions;
export default hospitalSlice.reducer;
