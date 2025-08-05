import { Api } from "@/helper/service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchItems = createAsyncThunk(
  "item/fetchItems",
  async () => {
    const response = await Api("GET", "/item/all", null, null);
    return response.data;
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default itemSlice.reducer;
export const selectItems = (state) => state.item.items;
export const selectLoading = (state) => state.item.loading;
export const selectError = (state) => state.item.error;
export const selectItemById = (state, id) =>
  state.item.items.find((item) => item._id === id) || null;
export const selectItemCount = (state) => state.item.items.length;
export const selectItemsByCategory = (state, category) =>
  state.item.items.filter((item) => item.category === category);
export const selectItemsByDispatcher = (state, dispatcherId) =>
  state.item.items.filter((item) => item.dispatcher._id === dispatcherId);
