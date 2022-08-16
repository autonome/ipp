import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { convertTitle } from 'utils/helper';
import { Service, Web3Storage } from 'web3.storage';
import * as Name from 'w3name';
import config from 'utils/config';

const client = new Web3Storage({ token: config.REACT_APP_WEB3_STORAGE_API_TOKEN } as Service);
const name = Name.parse(config.REACT_APP_WEB3_NAME);

const initialState = {
  Blogs: [] as string[],
  Users: [] as IUser[]
} as IDatabase;

export const createBlog = createAsyncThunk('createBlog', async (blog: IBlog) => {
  try {
    const title = convertTitle(blog.Title);
    const blob = new File([JSON.stringify(blog, null, 2)], title, {type: "application/json"})
    const rootCid = await client.put([blob], {
      name: title,
      maxRetries: 3,
    });

    const name = Name.parse(config.REACT_APP_WEB3_NAME);
    const revision = await Name.resolve(name);
    

    // const nextRevision = await Name.increment(revision, nextValue);
    // await Name.publish(nextRevision, name.key);
  } catch {
    return null;
  }
});


export const dbSlice = createSlice({
  name: 'dbSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBlog.fulfilled, (state: any, action: PayloadAction<any>) => {
      state.web3 = action.payload?.web3;
      console.log({ action });
      state.selectedAddress = action.payload?.account;
      state.chainId = action.payload?.chainId;
    });
  },
});

export default dbSlice.reducer;
