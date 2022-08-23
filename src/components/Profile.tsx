import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from "slices/dbSlice";
import { AppDispatch } from "slices/store";
import { NotificationManager } from "./Notification";
import { useNavigate } from "react-router-dom";

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

  const onCreate = () => {
    if (!account) {
      NotificationManager.warning("Please connect to the wallet", "Warn");
      return;
    }

    const user: IUser = {
      Type: "ADD_USER",
      Name: name,
      Wallet: account,
      Bio: bio
    };

    dispatch(createUser(user))
      .unwrap()
      .then((user) => {
        // handle result here
        NotificationManager.success(`"${user.Name}" Created`, "User Created");
        navigate("/main");
        console.log({user: user});
      })
      .catch((rejectedValueOrSerializedError) => {
        // handle error here
        console.log({rejectedValueOrSerializedError});
      });
  };

  const onFile = (e: any) => {
    setAvatar(e.target.files[0]);
  }

  return (
    <div className='profile-page'>
      <h2>Profile</h2>
      <label htmlFor='button-asset-images'>
        <input
          type='file'
          id='button-asset-images'
          name='image'
          multiple={true}
          onChange={onFile}
          required={true}
          style={{display: "none"}}
        />
        <Button variant='contained' component='span'>
          {avatar?.name || "Select Avatar"}
        </Button>
      </label>
      <TextField
        id="title"
        label="Name"
        variant="standard"
        size="small"
        onChange={(e: any) => setName(e.target.value)}
        value={name}
      />
      <TextField
        id="title"
        label="Wallet"
        variant="standard"
        size="small"
        value={account}
      />
      <TextField
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
        <Button variant="contained" onClick={onCreate}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default Profile;