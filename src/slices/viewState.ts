import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  syncing: false,
};

export const viewState = createSlice({
  name: "viewState",
  initialState,
  reducers: {
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSyncing: (state: any, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
  },
  extraReducers: (builder: any) => {},
});

export const { setLoading, setSyncing } = viewState.actions;

export default viewState.reducer;
