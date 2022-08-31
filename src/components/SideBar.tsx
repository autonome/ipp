import { Button } from "@mui/material";
import React from "react";
import { connectWallet, disconnectWallet } from "slices/web3Slice";
import { AppDispatch } from "slices/store";
import { trimAddress } from "utils/helper";
import { useDispatch, useSelector } from "react-redux";

interface ISideBar {}

const SideBar = (props: ISideBar) => {
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );
  const onConnect = () => {
    dispatch(account ? disconnectWallet() : connectWallet());
  };

  return (
    <div className="side-bar">
      <Button variant="contained" color="success" onClick={onConnect}>
        {account ? trimAddress(account) : "Connect Wallet"}
      </Button>
      <div className="tip-panel">
        <h3>Writing on IPP</h3>
        <div className="panel-body">
          <div className="panel-item">New writer FAQ</div>
          <div className="panel-item">Expert writing advice</div>
          <div className="panel-item">Grow your readership</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
