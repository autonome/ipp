import React, { useEffect, useState } from "react";
import { Service, Web3Storage } from "web3.storage";
import config from "utils/config";
import api from "utils/api";
import { getStorageItem, getW3link, setStorageItem } from "utils/helper";
import { AppDispatch } from "slices/store";
import { useDispatch, useSelector } from "react-redux";
import { resetFromLocalStorage } from "slices/dbSlice";
import { LinearProgress } from "@mui/material";
import { setLoading, setSyncing } from "slices/viewState";
import { fetchIPNSFromName, getCIDsFromIPNS } from "utils/web3.storage";
import { useNavigate, useParams } from "react-router-dom";
import useIPNSData from "hooks/useIPNSData";

interface ISyncWorker {}

const SyncWorker = (props: ISyncWorker) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSyncing = useSelector<any, boolean>(
    (state) => state.viewState.syncing
  );
  const syncedVersion = useSelector<any, number>(
    (state) => state.db.syncedVersion
  );
  const [progress, setProgress] = useState(0);
  const {ipnsCid} = useParams();
  const ipnsData = useIPNSData();

  useEffect(() => {
    sync();
    const intervalId = setInterval(() => sync(), 60000);
    return () => clearInterval(intervalId);
  }, [ipnsCid, ipnsData, syncedVersion]);

  const sync = async () => {
    if (!ipnsCid || ipnsCid === "undefined") {
      return;
    }

    console.log("ipnsCid: ", ipnsCid);

    // show syncing progress bar
    dispatch(setSyncing(true));
    // dispatch(setLoading(true));

    const client = new Web3Storage({
      token: config.REACT_APP_WEB3_STORAGE_API_TOKEN,
    } as Service);

    setProgress(1);

    // gets all cids uploaded to this ipns
    console.log("Stored ipnsData: ", ipnsData);
    const cids = await getCIDsFromIPNS(ipnsData);
    console.log("Stored cids: ", cids);

    // get the latest synced address
    let lastSyncNumber = getStorageItem(config.LAST_SYNC_NUMBER + ipnsCid, 0) || 0;

    // reads data from the w3.storage
    setProgress((lastSyncNumber * 100) / (cids.length || 1));
    for (let i = lastSyncNumber; i < cids.length; i++) {
      setStorageItem(config.LAST_SYNC_NUMBER + ipnsCid, i);
      setProgress((i * 100) / (cids.length || 1));

      // get IPFS data
      const contentRes = await api.get(getW3link(cids[i]));
      const { data } = contentRes;

      // parse each transactions
      if (["ADD_BLOG", "UPDATE_BLOG"].includes(String(data.Type))) {
        const contentRes1 = await api.get(getW3link(data.BodyCID));
        data.Body = contentRes1.data;
      }

      const record = {
        ...data,
        CID: cids[i],
      };

      // add record to the local storage
      setStorageItem(config.LAST_SYNC_RECORD + ipnsCid + i, record);
    }

    console.log("Last sync number title: ", config.LAST_SYNC_NUMBER + ipnsCid);
    setStorageItem(config.LAST_SYNC_NUMBER + ipnsCid, cids.length);
    setProgress(100);

    dispatch(resetFromLocalStorage({ lastSyncNumber, name: ipnsCid }));
    dispatch(setSyncing(false));
    setProgress(0);
    // dispatch(setLoading(false));

    // setTimeout(sync, 60000);
  };

  return isSyncing ? (
    <div className="sync-component" title={"Syncing " + progress + "%"}>
      {progress >= 0 && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color="success"
        />
      )}
    </div>
  ) : null;
};

export default SyncWorker;
