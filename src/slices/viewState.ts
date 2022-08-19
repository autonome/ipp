import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState = {
  loading: false
};

export const viewState = createSlice({
  name: 'viewState',
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

export const {setLoading} = viewState.actions;

export default viewState.reducer;
