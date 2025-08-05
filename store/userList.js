import { Api } from "@/helper/service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserList = createAsyncThunk(
  "user/fetchUserList",
  async (role) => {
    const response = await Api("GET", `/auth/all/${role}`, null, null);
    return response.data;
  }
);
    
const userSlice = createSlice({
  name: "user",
  initialState: {
    userList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload || [];
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { } = userSlice.actions;

export default userSlice.reducer;
