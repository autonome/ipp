import CryptoJS from 'crypto-js';
import config from 'utils/config';

// ---------------------- crypto ------------------------------------------
export const encryptJson = (data: any) => {
  const encryptedData = encrypt(JSON.stringify(data));
  return encryptedData.toString();
};

export const decryptJson = (ciphertext: any) => {
  const decryptedData = decrypt(ciphertext);
  return JSON.parse(decryptedData);
};

export const encrypt = (data: any) => {
  const key = CryptoJS.enc.Utf8.parse('7z6173W3af31er33');
  const iv = CryptoJS.enc.Utf8.parse('7z6173W44f31er33');
  const encryptedData = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(String(data)),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  return encryptedData.toString();
};

export const decrypt = (ciphertext: any) => {
  const key = CryptoJS.enc.Utf8.parse('7z6173W3af31er33');
  const iv = CryptoJS.enc.Utf8.parse('7z6173W44f31er33');
  const decryptedData = CryptoJS.AES.decrypt(
    ciphertext,
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  return decryptedData.toString(CryptoJS.enc.Utf8);
};

// ---------------------- local storage --------------------------------------------------------------
export const setStorageItem = (key: string, data: any) => {
  localStorage.setItem(config.appID + '_' + key, encryptJson(JSON.stringify(data)));
};

export const getStorageItem = (key: string, defaultVal: any) => {
  try {
    return JSON.parse(
      decryptJson(localStorage.getItem(config.appID + '_' + key) as string)
    );
  } catch (e) {
    return defaultVal || false;
  }
};

export const deleteStorageItem = (key: string) => {
  localStorage.removeItem(config.appID + '_' + key);
};

export const trimAddress = (address: string) => {
  if (!address) {
    return "";
  }
  
  return (
    '0x' + address.substring(2, 6).toLowerCase() +
    '...' +
    address.substring(address.length - 4).toLowerCase()
  );
};

export async function base64toBlob(base64Data: any, contentType: any): Promise<Blob> {
  const base64Response = await fetch(base64Data);
  const blob = await base64Response.blob();
  return blob;
}

export function convertTitle(str: string) {
  const str1 = str.toLowerCase();
  let res = "";
  for (let i = 0; i < str1.length; i++) {
    const str2 = str1.substring(i, i + 1);
    if ((str2[0] >= 'a' && str2[0] <= 'z') || (str2[0] >= '0' && str2[0] <= '9') || str2[0] === '-' || str2[0] === '_') {
      res += str2;
    } else {
      res += "-";
    }
  }
  return res;
}

export function getW3link(cid: string) {
  // return `https://w3s.link/ipfs/${cid}`;
  // return `https://${cid}.ipfs.w3s.link/`;
  return `https://braindance.mypinata.cloud/ipfs/${cid}`;
}

export function sleep(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), ms);
  })
}
