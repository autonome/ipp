import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
      bridge: 'https://bridge.walletconnect.org/',
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

let web3: any;

const initialState = {
  web3: null as any,
  selectedAddress: undefined as any,
  chainId: undefined as any,
};

export const connectWallet = createAsyncThunk('connectWallet', async () => {
  try {
    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();
    const chainId = await web3.eth.net.getId();
    return {web3, account, chainId};
  } catch (ex) {
    console.log(ex);
    return null;
  }
});

export const disconnectWallet = createAsyncThunk(
  'disconnectWallet',
  async () => {
    try {
      await web3Modal.clearCachedProvider();
      return null;
    } catch {
      return null;
    }
  }
);

export const web3Slice = createSlice({
  name: 'web3',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectWallet.fulfilled, (state: any, action: PayloadAction<any>) => {
      state.web3 = action.payload?.web3;
      state.selectedAddress = action.payload?.account;
      state.chainId = action.payload?.chainId;
    });
    builder.addCase(
      disconnectWallet.fulfilled,
      (state: any, action: IAction) => {
        state.web3 = null;
        state.selectedAddress = null;
        state.chainId = null;
      }
    );
  },
});

export default web3Slice.reducer;



/*
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { enableFilecoinSnap } from "@chainsafe/filsnap-adapter";
import { initiateFilecoinSnap } from "utils/metamask";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
      bridge: "https://bridge.walletconnect.org/",
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: false, // optional
  providerOptions, // required
});

let web3: any;

const initialState = {
  web3: null as any,
  metamaskFilecoinSnap: undefined as any,
  filecoinApi: undefined as any
};

export const connectWallet = createAsyncThunk("connectWallet", async () => {
  try {
    const installResult = await initiateFilecoinSnap();
    let filecoinApi = null;
    if (installResult.isSnapInstalled) {
      sessionStorage.setItem("metamask-snap", "connected");
      filecoinApi = await installResult.snap?.getFilecoinSnapApi();
    }
    return {
      snap: installResult.snap,
      filecoinApi
    };
  } catch {
    return null;
  }
});

export const disconnectWallet = createAsyncThunk(
  "disconnectWallet",
  async () => {
    try {
      await web3Modal.clearCachedProvider();
      return null;
    } catch {
      return null;
    }
  }
);

export const web3Slice = createSlice({
  name: "web3",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      connectWallet.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.metamaskFilecoinSnap = action.payload?.metamaskFilecoinSnap;
        state.filecoinApi = action.payload?.filecoinApi;
        console.log({ action });
      }
    );
    builder.addCase(
      disconnectWallet.fulfilled,
      (state: any, action: IAction) => {
        state.web3 = null;
        state.selectedAddress = null;
        state.chainId = null;
      }
    );
  },
});

export default web3Slice.reducer;
*/
