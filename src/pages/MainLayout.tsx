import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import routes from "routes";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "slices/store";
import { setLoading } from "slices/viewState";
import config from "utils/config";
import { getStorageItem, setStorageItem } from "utils/helper";
import { fetchIPNS } from "utils/web3.storage";
import * as Name from "w3name";

interface IMainLayout {}

const MainLayout = (props: IMainLayout) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );
  const {ipnsCid} = useParams();

  useEffect(() => {
    (async function() {
      if (!account) {
        return;
      }

      dispatch(setLoading(true));

      const version = getStorageItem(config.VERSION_LABEL, "") || "";
      if (version !== config.version) {
        window.localStorage.clear();
        setStorageItem(config.VERSION_LABEL, config.version);
      }

      let ipnsCid1 = (getStorageItem(config.IPNS_DATA + account, "") || "");
      if (!ipnsCid1) {
        const ipnsData = await fetchIPNS(account);
        const name = await Name.from(new Uint8Array(ipnsData));
        ipnsCid1 = name.toString();
        setStorageItem(config.IPNS_DATA + ipnsCid1, ipnsData);
      }
      setStorageItem(config.IPNS_DATA + account, ipnsCid1);

      // redirect page
      console.log("Reditect url: ", `/main/${ipnsCid1}`);
      dispatch(setLoading(false));

      if (!ipnsCid) {
        navigate(`/main/${ipnsCid1}`);
      }
    })();
  }, [account]);

  return (
    <Routes>
      {routes.map((e) => (
        <Route
          key={e.path}
          path={e.path}
          element={React.createElement(e.component)}
        />
      ))}
      <Route path="*" element={<Navigate to={`/main/${ipnsCid}/`} />} />
    </Routes>
  );
};

export default MainLayout;
