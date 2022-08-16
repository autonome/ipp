import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState = {
  loading: false
};

export const web3Slice = createSlice({
  name: 'web3',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
  },
});

export const {setLoading} = web3Slice.actions;

export default web3Slice.reducer;
