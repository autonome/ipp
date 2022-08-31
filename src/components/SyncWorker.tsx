import React, { useEffect } from "react";
import { Service, Upload, Web3Storage } from "web3.storage";
import config from "utils/config";
import api from "utils/api";
import { getStorageItem, getW3link, setStorageItem } from "utils/helper";
import { AppDispatch } from "slices/store";
import { useDispatch, useSelector } from "react-redux";
import { resetFromLocalStorage } from "slices/dbSlice";
import { LinearProgress } from "@mui/material";
import { setSyncing } from "slices/viewState";

interface ISyncWorker {}

const SyncWorker = (props: ISyncWorker) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSyncing = useSelector<any, boolean>((state) => state.viewState.syncing);

  useEffect(() => {
    const lastSyncNumber = getStorageItem(config.LAST_SYNC_NUMBER, 0) || 0;
    dispatch(resetFromLocalStorage(lastSyncNumber));
    sync();
  }, []);

  const sync = async () => {
    dispatch(setSyncing(true));
    const client = new Web3Storage({
      token: config.REACT_APP_WEB3_STORAGE_API_TOKEN,
    } as Service);

    const uploadObjects: Upload[] = [];
    for await (const upload of client.list()) {
      uploadObjects.push(upload);
    }

    uploadObjects.sort((a, b) => (a.created > b.created) ? 1 : -1)
    const lastSyncNumber = getStorageItem(config.LAST_SYNC_NUMBER, 0) || 0;
    for (let i = lastSyncNumber; i < uploadObjects.length; i++) {
      const upload = uploadObjects[i];
      if (upload.name.indexOf("image_") === 0) {
        setStorageItem(config.LAST_SYNC_NUMBER, i + 1);
        continue;
      }
      const res = await client.get(uploadObjects[i].cid);
      if (!res) {
        continue;
      }

      // get IPFS data
      const contentRes = await api.get(getW3link(upload.cid));
      const {data} = contentRes;
      const record = {
        ...data,
        CID: upload.cid,
        Date: new Date(upload.created)
      };

      // add record to the local storage
      setStorageItem(config.LAST_SYNC_RECORD + i, record);
      setStorageItem(config.LAST_SYNC_NUMBER, i + 1);
    }

    dispatch(resetFromLocalStorage(lastSyncNumber));
    dispatch(setSyncing(false));
    console.log("LastSyncNumber: ", getStorageItem(config.LAST_SYNC_NUMBER, 0));

    setTimeout(sync, 30000);
  };

  return isSyncing ? (
    <div className="sync-component" title="Syncing ...">
      <LinearProgress color="success" />
    </div>
  ) : null;
};

export default SyncWorker;
