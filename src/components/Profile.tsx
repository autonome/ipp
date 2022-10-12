import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, uploadImage } from "slices/dbSlice";
import { AppDispatch } from "slices/store";
import { NotificationManager } from "./Notification";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { setLoading } from "slices/viewState";
import { getStorageItem, getW3link } from "utils/helper";
import * as Name from "w3name";
import config from "utils/config";

interface IProfile {}

const Profile = (props: IProfile) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );
  const [avatar, setAvatar] = useState<File | null>(null);
  const {ipnsCid} = useParams();
  const users = useSelector<any, { [key: string]: IUser }>(
    (state) => state.db.Users
  );
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    setCurrentUser(account ? users[account] : null);
  }, [account, users]);

  useEffect(() => {
    setName(currentUser?.Name || "");
    setBio(currentUser?.Bio || "");
    setAvatar(null);
  }, [currentUser]);

  const onSave = async () => {
    if (!account) {
      NotificationManager.warning("Please connect to the wallet", "Warn");
      return;
    }

    try {
      dispatch(setLoading(true));
      const myIpnsCid = getStorageItem(config.IPNS_DATA + account, "");

      // save avatar
      let imageUrl: any = null;
      if (avatar) {
        imageUrl = await dispatch(uploadImage({file: avatar, ipnsCid: myIpnsCid})).unwrap();
      } else if (currentUser?.Image) {
        imageUrl = currentUser?.Image;
      }

      const user: IUser = {
        Type: "ADD_USER",
        Name: name,
        Wallet: account,
        Bio: bio,
      };

      if (imageUrl) {
        user.Image = imageUrl;
      }

      dispatch(createUser({user, ipnsCid: myIpnsCid}))
        .unwrap()
        .then((user) => {
          // handle result here
          NotificationManager.success("", "Saved");
          navigate(`/main/${ipnsCid}`);
          dispatch(setLoading(false));
        })
        .catch((rejectedValueOrSerializedError) => {
          // handle error here
          console.error({ rejectedValueOrSerializedError });
          dispatch(setLoading(false));
        });
    } catch (ex) {}
  };

  const onFile = (e: any) => {
    setAvatar(e.target.files[0]);
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <label htmlFor="button-asset-images">
        <input
          type="file"
          id="button-asset-images"
          name="image"
          multiple={true}
          onChange={onFile}
          required={true}
          style={{ display: "none" }}
        />
        {avatar ? (
          <Avatar
            name="Avatar"
            size="200px"
            round={true}
            src={avatar ? URL.createObjectURL(avatar) : ""}
          />
        ) : (
          <Avatar
            name="Avatar"
            size="200px"
            round={true}
            src={currentUser?.Image ? getW3link(currentUser?.Image) : ""}
          />
        )}
      </label>
      <TextField
        fullWidth
        label="Name"
        variant="standard"
        size="small"
        onChange={(e: any) => setName(e.target.value)}
        value={name}
        className="name"
      />
      <TextField
        fullWidth
        label="IPNS"
        variant="standard"
        size="small"
        value={getStorageItem(config.IPNS_DATA + account, "")}
        className="name"
      />
      <TextField
        fullWidth
        label="Wallet"
        variant="standard"
        size="small"
        value={account}
        className="wallet"
      />
      <TextField
        fullWidth
        id="body"
        label="Bio"
        variant="standard"
        multiline
        maxRows={30}
        size="small"
        onChange={(e: any) => setBio(e.target.value)}
        value={bio}
      />
      <div className="submit">
        <Button variant="contained" onClick={onSave} fullWidth>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Profile;
