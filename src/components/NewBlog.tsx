import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "slices/dbSlice";
import { AppDispatch } from "slices/store";
import { NotificationManager } from "./Notification";

interface INewBlog {}

const NewBlog = (props: INewBlog) => {
  const dispatch = useDispatch<AppDispatch>();
  const web3 = useSelector<any, any>((state) => state.web3.web3);
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );
  const chainId = useSelector<any, number | null>(
    (state) => state.web3.chainId
  );

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const onCreate = () => {
    if (!account) {
      NotificationManager.warning("Please connect to the wallet", "Warn");
      return;
    }

    const blog: IBlog = {
      Title: title,
      Body: body,
      Creator: account.toLowerCase(),
      Followers: []
    };

    dispatch(createBlog(blog)).then(res => {
      console.log({res});
    }, err => {
      console.log({err});
    });
  };

  return (
    <div className="new-blog-page">
      <TextField
        id="title"
        label="Title"
        variant="standard"
        size="small"
        onChange={(e: any) => setTitle(e.target.value)}
        value={title}
      />
      <TextField
        id="body"
        label="Text"
        variant="standard"
        multiline
        maxRows={30}
        size="small"
        onChange={(e: any) => setBody(e.target.value)}
        value={body}
      />
      <div className="submit">
        <Button variant="contained" onClick={onCreate}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default NewBlog;
