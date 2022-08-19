import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { convertTitle, getStorageItem } from 'utils/helper';
import { Service, Web3Storage } from 'web3.storage';
import config from 'utils/config';

const client = new Web3Storage({ token: config.REACT_APP_WEB3_STORAGE_API_TOKEN } as Service);
const clientDb = new Web3Storage({ token: config.REACT_APP_WEB3_STORAGE_API_DB_TOKEN } as Service);


const initialState = {
  Blogs: [] as string[],
  Users: [] as IUser[]
} as IDatabase;

export const createBlog = createAsyncThunk('createBlog', async (blog: IBlog) => {
  try {
    const title = convertTitle(blog.Title);
    let blob = new File([JSON.stringify(blog, null, 2)], title + "_1", {type: "application/json"})
    const rootCid = await client.put([blob], {
      name: title,
      maxRetries: 3,
      wrapWithDirectory: false
    });

    const dbAction: IDatabaseAction = {
      Type: "ADD_BLOG",
      CID: rootCid
    };

    blob = new File([JSON.stringify(dbAction, null, 2)], title + "_1", {type: "application/json"})
    await clientDb.put([blob], {
      name: "add_blog_" + title,
      maxRetries: 3,
      wrapWithDirectory: false
    });

    return blog;
  } catch {
    return false;
  }
});

export const dbSlice = createSlice({
  name: 'dbSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    resetFromLocalStorage: (state: IDatabase, action: PayloadAction) => {
      state.Blogs = getStorageItem(config.LAST_SYNC_BLOGS, []) || [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createBlog.fulfilled, (state: any, action: PayloadAction<any>) => {
    });
  },
});

export const {resetFromLocalStorage} = dbSlice.actions;

export default dbSlice.reducer;
