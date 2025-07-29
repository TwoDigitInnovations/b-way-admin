import { Api } from "@/helper/service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRoutes = createAsyncThunk("route/fetchRoutes", async () => {
  const response = await Api("GET", "/route", null, null);
  return response.data;
});

const routeSlice = createSlice({
  name: "route",
  initialState: {
    routes: [],
    assignedRoute: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAssignedRoute: (state, action) => {
      state.assignedRoute = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload || [];
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setAssignedRoute } = routeSlice.actions;
export default routeSlice.reducer;
