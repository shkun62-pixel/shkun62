import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* ---------- 1) async thunk ---------- */
export const fetchSaleData = createAsyncThunk(
  'sales/fetchSaleData',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
      );
      return data;
    } catch (err) {
      // optional: show toast, log, etc.
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------- 2) slice ---------- */
const saleSlice = createSlice({
  name: 'sales',
  initialState: {
    items: [],
    status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    /* sync reducers go here if you need them */
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaleData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSaleData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSaleData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default saleSlice.reducer;
