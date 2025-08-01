import { Api } from "@/helper/service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk
export const fetchRoutes = createAsyncThunk(
  "route/fetchRoutes",
  async ({ page = 0, limit = 0 } = {}, { rejectWithValue }) => {
    try {
      console.log(`Fetching routes with page=${page}, limit=${limit}`);
      const response = await Api(
        "GET",
        `/route?page=${page}&limit=${limit}`,
        null,
        null
      );
      console.log("API Response for routes:", response);
      
      if (response.status) {
        return response;
      } else {
        return rejectWithValue("Failed to fetch routes");
      }
    } catch (error) {
      console.error("Error in fetchRoutes:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const routeSlice = createSlice({
  name: "route",
  initialState: {
    routes: [],
    assignedRoute: null,
    total: 0,
    page: 1,
    limit: 10,
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
        console.log("fetchRoutes fulfilled with payload:", action.payload);
        
        if (action.payload && action.payload.data) {
          state.routes = action.payload.data;
          state.total = action.payload.total || action.payload.data.length;
          state.page = action.payload.page || 1;
          state.limit = action.payload.limit || state.limit;
        } else {
          state.routes = [];
          state.total = 0;
        }
        state.error = null;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.routes = [];
        console.error("fetchRoutes rejected:", action.payload || action.error.message);
      });
  },
});

export const { setAssignedRoute } = routeSlice.actions;

// Selectors
export const selectRoutes = (state) => state.route.routes;
export const selectAssignedRoute = (state) => state.route.assignedRoute;
export const selectTotal = (state) => state.route.total;
export const selectPage = (state) => state.route.page;
export const selectLimit = (state) => state.route.limit;
export const selectLoading = (state) => state.route.loading;
export const selectError = (state) => state.route.error;

export default routeSlice.reducer;
