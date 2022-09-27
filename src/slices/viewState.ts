import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ViewState {
  loading: boolean;
  syncing: boolean;
  constructing: boolean;
}

const initialState: ViewState = {
  loading: false,
  syncing: false,
  constructing: false,
};

export const viewState = createSlice({
  name: "viewState",
  initialState,
  reducers: {
    setLoading: (state: ViewState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSyncing: (state: ViewState, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
    setConstructing: (state: ViewState, action: PayloadAction<boolean>) => {
      state.constructing = action.payload;
    },
  },
  extraReducers: (builder: any) => {},
});

export const { setLoading, setSyncing, setConstructing } = viewState.actions;

export default viewState.reducer;
