import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "slices/dbSlice";
import { AppDispatch } from "slices/store";
import { NotificationManager } from "./Notification";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

interface INewBlog {}

const NewBlog = (props: INewBlog) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const onCreate = () => {
    if (!account) {
      NotificationManager.warning("Please connect to the wallet", "Warn");
      return;
    }

    const blog: IBlog = {
      Type: "ADD_BLOG",
      UUID: uuidv4(),
      Title: title,
      Body: body,
      Creator: account.toLowerCase(),
      Followers: [],
    };

    dispatch(createBlog(blog))
      .unwrap()
      .then((blog) => {
        // handle result here
        NotificationManager.success(`"${blog.Title}" Created`, "Blog Created");
        navigate("/main");
        console.log({blog});
      })
      .catch((rejectedValueOrSerializedError) => {
        // handle error here
        console.log({rejectedValueOrSerializedError});
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
