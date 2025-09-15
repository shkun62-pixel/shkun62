import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* ---------- 1) async thunk ---------- */
export const fetchDetailsFromGST = createAsyncThunk(
  'sales/fetchDetailsFromGST',
  async (GST, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        { Gstin: GST } // Sending GST in the body as JSON
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------- 2) slice ---------- */
const ledgerSlice = createSlice({
  name: 'ledgers',
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
      .addCase(fetchDetailsFromGST.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDetailsFromGST.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDetailsFromGST.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default ledgerSlice.reducer;
