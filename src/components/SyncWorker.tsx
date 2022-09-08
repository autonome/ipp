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
import * as Name from 'w3name';

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
    let lastSyncNumber = getStorageItem(config.LAST_SYNC_NUMBER, 0) || 0;
    const version = getStorageItem(config.VERSION_LABEL, "") || "";
    if (version !== config.version) {
      lastSyncNumber = 0;
      setStorageItem(config.VERSION_LABEL, config.version);
    }


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

      // parse each transactions
      switch (data.Type) {
        case "ADD_BLOG":
        case "UPDATE_BLOG": {
          const contentRes1 = await api.get(getW3link(data.BodyCID));
          data.Body = contentRes1.data;
          break;
        }

        default:
          break;
      }

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

    const bytes = [8, 1, 18, 64, 156, 104, 197, 108, 98, 238, 128, 116, 13, 126, 208, 222, 80, 194, 183, 170, 167, 73, 250, 124, 95, 102, 184, 215, 105, 153, 34, 130, 205, 105, 151, 223, 0, 176, 176, 185, 153, 101, 20, 176, 194, 194, 102, 62, 44, 89, 48, 122, 163, 78, 28, 242, 74, 14, 169, 203, 130, 18, 135, 200, 126, 8, 192, 182];
    const name = await Name.from(new Uint8Array(bytes));
    const revision = await Name.resolve(name);
    console.log("RSS Feed:", revision.value);

    setTimeout(sync, 30000);
  };

  return isSyncing ? (
    <div className="sync-component" title="Syncing ...">
      <LinearProgress color="success" />
    </div>
  ) : null;
};

export default SyncWorker;
