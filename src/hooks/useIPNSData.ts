import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "utils/config";
import { getStorageItem, setStorageItem } from "utils/helper";
import { fetchIPNSFromName } from "utils/web3.storage";

const useIPNSData = () => {
  const { ipnsCid } = useParams();
  const [ipnsData, setIpnsData] = useState<number[]>([]);
  useEffect(() => {
    (async function() {
      if (!ipnsCid || ipnsCid === "undefined") {
        return;
      }

      let _ipnsData = getStorageItem(config.IPNS_DATA + ipnsCid, []) || [];
      if (_ipnsData.length === 0) {
        _ipnsData = await fetchIPNSFromName(ipnsCid);
        setStorageItem(config.IPNS_DATA + ipnsCid, _ipnsData);
      }

      setIpnsData(_ipnsData);
    })();
  }, [ipnsCid]);

  return ipnsData;
}

export default useIPNSData;
