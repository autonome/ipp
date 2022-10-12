import { Service, Upload, Web3Storage } from "web3.storage";
import api from "./api";
import config from "./config";
import { getW3link } from "./helper";
import * as Name from 'w3name';

export async function fetchIPNS(account: string) {
  const client = new Web3Storage({
    token: config.REACT_APP_WEB3_STORAGE_IPNS_API_TOKEN,
  } as Service);

  const uploadObjects: Upload[] = [];
  for await (const upload of client.list()) {
    uploadObjects.push(upload);
  }

  const uploadName = "wallet_" + account;
  uploadObjects.sort((a, b) => (a.created > b.created ? 1 : -1));
  for (let i = 0; i < uploadObjects.length; i++) {
    const upload = uploadObjects[i];
    if (upload.name.indexOf(uploadName) === 0) {
      const contentRes = await api.get(getW3link(upload.cid));
      return contentRes.data as number[];
    }
  }

  console.log("No name found");
  // wallet is not registered yet
  const name = await Name.create();
  const value = 'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui';
  const revision = await Name.v0(name, value);
  await Name.publish(revision, name.key);
  console.log("New name has been created: ", name.toString());

  const bytes = Array.from(name.key.bytes) as number[];
  uploadData(client, uploadName + "_" + name.toString(), bytes);
  return bytes;
}

export async function fetchIPNSFromName(ipnsCid: string) {
  const client = new Web3Storage({
    token: config.REACT_APP_WEB3_STORAGE_IPNS_API_TOKEN,
  } as Service);

  const uploadObjects: Upload[] = [];
  for await (const upload of client.list()) {
    uploadObjects.push(upload);
  }

  uploadObjects.sort((a, b) => (a.created > b.created ? 1 : -1));
  for (let i = 0; i < uploadObjects.length; i++) {
    const upload = uploadObjects[i];
    if (upload.name.indexOf(ipnsCid) >= 0) {
      const contentRes = await api.get(getW3link(upload.cid));
      return contentRes.data as number[];
    }
  }

  return null;
}

export async function uploadData(client: Web3Storage, title: string, data: any, type: string = "application/json") {
  try {
    const blob = new File([JSON.stringify(data, null, 2)], title, {
      type,
    });

    const rootCid = await client.put([blob], {
      name: title,
      maxRetries: 3,
      wrapWithDirectory: false,
    });

    return rootCid;
  } catch (err: any) {
    return undefined;
  }
}

export async function addCIDtoIPNS(ipnsData: number[], cid: string) {
  const name = await Name.from(new Uint8Array(ipnsData));
  const revision = await Name.resolve(name);

  // let {data} = await api.get(getW3link(revision.value));
  let {data} = await api.get(`https://${revision.value}.ipfs.w3s.link/`);
  if (Array.isArray(data)) {
    data.push(cid);
  }
  else {
    data = [cid];
  }

  const client = new Web3Storage({
    token: config.REACT_APP_WEB3_STORAGE_API_TOKEN,
  } as Service);
  const newCID = await uploadData(client, "ipns_" + cid, data);

  const nextRevision = await Name.increment(revision, newCID || "");
  await Name.publish(nextRevision, name.key);

  console.log("nextRevision value: ", nextRevision.value);
}

export async function getCIDsFromIPNS(ipnsData: number[]) {
  const name = await Name.from(new Uint8Array(ipnsData));
  const revision = await Name.resolve(name);
  console.log("Latest revision value: ", revision.value);
  // let {data} = await api.get(getW3link(revision.value));
  let {data} = await api.get(`https://${revision.value}.ipfs.w3s.link/`);
  return Array.isArray(data) ? data : [];

  // const name = await Name.from(new Uint8Array(ipnsData));
  // let {data} = await api.get(`https://${name.toString()}.ipns.w3s.link/`);
  // return Array.isArray(data) ? data : [];
}
