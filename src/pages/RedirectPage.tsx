import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "slices/store";
import { setLoading } from "slices/viewState";
import config from "utils/config";
import { getStorageItem, setStorageItem } from "utils/helper";
import { fetchIPNS } from "utils/web3.storage";
import * as Name from "w3name";

interface IRedirectPage {}

const RedirectPage = (props: IRedirectPage) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );

  // useEffect(() => {
  //   (async function() {
  //     if (!account) {
  //       return;
  //     }

  //     dispatch(setLoading(true));
  //     let ipnsData = (getStorageItem(config.ACCOUNT_IPNS + account, []) || []) as number[];
  //     if (!ipnsData.length) {
  //       ipnsData = await fetchIPNS(account);
  //       setStorageItem(config.ACCOUNT_IPNS + account, ipnsData)
  //     }

  //     dispatch(setIPNSData(ipnsData));

  //     // redirect page
  //     const name = await Name.from(new Uint8Array(ipnsData));
  //     console.log("Reditect url: ", `/main/${name.toString()}`);
  //     dispatch(setLoading(false));
  //     navigate(`/main/${name.toString()}`);
  //   })();
  // }, [account]);

  return (
    null
  );
};

export default RedirectPage;
