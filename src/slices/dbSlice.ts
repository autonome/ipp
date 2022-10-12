import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { convertTitle, getStorageItem } from "utils/helper";
import { Service, Web3Storage } from "web3.storage";
import config from "utils/config";
import { updateRss } from "utils/rss";
import { addCIDtoIPNS, uploadData } from "utils/web3.storage";

const client = new Web3Storage({
  token: config.REACT_APP_WEB3_STORAGE_API_TOKEN,
} as Service);

const initialState = {
  Initialized: false,
  ipnsData: [] as Number[],
  Blogs: [] as IBlog[],
  Users: {} as { [key: string]: IUser },
} as IDatabase;

export const createBlog = createAsyncThunk(
  "createBlog",
  async (data: any, { rejectWithValue }) => {
    try {
      const {blog, ipnsCid} = data;
      // upload blog body
      let title = "blogbody_" + convertTitle(blog.Title);
      blog.BodyCID = await uploadData(client, title, blog.Body, "text/plain") || "";
      blog.Body = undefined;

      // upload blog
      title = "blog_" + convertTitle(blog.Title);
      blog.Date = new Date();
      blog.CID = await uploadData(client, title, blog);

      // add updating to the ipns
      const ipnsData = getStorageItem(config.IPNS_DATA + ipnsCid, []) || [];
      if (ipnsData.length === 0) {
        alert("ipnsData is empty");
      }

      await addCIDtoIPNS(ipnsData, blog.CID || "");

      // update rss
      updateRss();
      return blog;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  "createUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const {user, ipnsCid} = data;
      const title = "user_" + convertTitle(user.Wallet);
      user.CID = await uploadData(client, title, user);

      // add updating to the ipns
      const ipnsData = getStorageItem(config.IPNS_DATA + ipnsCid, []) || [];
      if (ipnsData.length === 0) {
        alert("ipnsData is empty");
      }

      await addCIDtoIPNS(ipnsData, user.CID || "");

      return user;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "uploadImage",
  async (data: any, { rejectWithValue }) => {
    try {
      const {file, ipnsCid} = data;
      const rootCid = await client.put([file], {
        name: "image_" + new Date().getTime().toString(),
        maxRetries: 3,
        wrapWithDirectory: false,
      });

      // add updating to the ipns
      const ipnsData = getStorageItem(config.IPNS_DATA + ipnsCid, []) || [];
      if (ipnsData.length === 0) {
        alert("ipnsData is empty");
      }

      await addCIDtoIPNS(ipnsData, rootCid || "");

      return rootCid;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const dbSlice = createSlice({
  name: "dbSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    resetFromLocalStorage: (state: IDatabase, action: PayloadAction<any>) => {
      // dispose individual action

      console.log("resetFromLocalStorage payload: ", action.payload);
      const startNumber = 0;//state.Initialized ? action.payload.lastSyncNumber : 0;
      const nameString = action.payload.name;
      const blogs = startNumber > 0 ? state.Blogs : [];
      const users = state.Users;
      const lastSyncNumber =
        getStorageItem(config.LAST_SYNC_NUMBER + nameString, 0) || 0;
      console.log("Last synced number in resetFromLocalStorage: ", lastSyncNumber);
      console.log("Last synced number title in resetFromLocalStorage: ", config.LAST_SYNC_NUMBER + nameString);
      for (let i = startNumber; i < lastSyncNumber; i++) {
        const data =
          getStorageItem(config.LAST_SYNC_RECORD + nameString + i, {}) || {};
        // if (!data.Date) {
        //   continue;
        // }

        data.Date = new Date(data.Date);
        console.log({data});
        switch (data.Type) {
          case "ADD_BLOG":
            blogs.push(data);
            break;

          case "UPDATE_BLOG": {
            const index = blogs.findIndex((blog) => blog.UUID === data.UUID);
            if (index !== -1) {
              blogs[index] = data;
            }
            break;
          }

          case "ADD_USER":
            users[data.Wallet] = data;
            break;

          default:
            break;
        }
      }

      blogs.sort((a, b) =>
        (a.Date || new Date()) < (b.Date || new Date()) ? 1 : -1
      );
      state.Blogs = blogs;
      state.Users = users;
      state.Initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      createBlog.fulfilled,
      (state: any, action: PayloadAction<any>) => {}
    );
  },
});

export const { resetFromLocalStorage } = dbSlice.actions;

export default dbSlice.reducer;
