import React, { useEffect } from "react";
import { Service, Upload, Web3Storage } from "web3.storage";
import config from "utils/config";
import api from "utils/api";
import { getStorageItem, getW3link, setStorageItem, sleep } from "utils/helper";
import { AppDispatch } from "slices/store";
import { useDispatch } from "react-redux";
import { resetFromLocalStorage } from "slices/dbSlice";

interface ISyncWorker {}

const SyncWorker = (props: ISyncWorker) => {
  const dispatch = useDispatch<AppDispatch>();
  let blogs: IBlog[] = [];

  useEffect(() => {
    sync();
  }, []);

  const sync = async () => {
    const clientDb = new Web3Storage({
      token: config.REACT_APP_WEB3_STORAGE_API_DB_TOKEN,
    } as Service);

    const uploadObjects: Upload[] = [];
    for await (const upload of clientDb.list()) {
      uploadObjects.push(upload);
    }

    uploadObjects.sort((a, b) => (a.created > b.created) ? 1 : -1)

    blogs = getStorageItem(config.LAST_SYNC_BLOGS, []) || [];
    const lastSyncNumber = getStorageItem(config.LAST_SYNC_NUMBER, 0) || 0;

    console.log({blogs, lastSyncNumber});
    for (let i = lastSyncNumber; i < uploadObjects.length; i++) {
      const res = await clientDb.get(uploadObjects[i].cid);
      if (!res) {
        continue;
      }

      const files = await res.files();
      for (const file of files) {
        const contentRes = await api.get(getW3link(file.cid));
        await doDbAction(contentRes.data, uploadObjects[i]);
      }

      setStorageItem(config.LAST_SYNC_NUMBER, i + 1);
    }

    blogs = [];
    dispatch(resetFromLocalStorage());
  };

  // dispose individual action
  const doDbAction = async (action: IDatabaseAction, upload: Upload) => {
    console.log(action);

    switch (action.Type) {
      case "ADD_BLOG":
        const res = await api.get(getW3link(action.CID));
        blogs.push({
          ...res.data,
          CID: action.CID,
          Date: new Date(upload.created)
        });
        setStorageItem(config.LAST_SYNC_BLOGS, blogs);
        break;
    }
  }

  return null;
};

export default SyncWorker;
