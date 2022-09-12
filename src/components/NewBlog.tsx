import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "slices/dbSlice";
import { AppDispatch } from "slices/store";
import { NotificationManager } from "./Notification";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading } from "slices/viewState";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";
import { removeHtmlTags } from "utils/helper";

interface INewBlog {}

const NewBlog = (props: INewBlog) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const {uuid} = useParams();
  const blogs = useSelector<any, IBlog[]>((state) => state.db.Blogs);
  const [curBlog, setCurBlog] = useState<IBlog | undefined>(undefined);

  useEffect(() => {
    const blog1 = blogs.find((b) => b.UUID === uuid);
    setCurBlog(blog1);
    setTitle(blog1?.Title || "");
    setBody(blog1?.Body || "");
  }, [blogs, uuid]);

  const onCreate = () => {
    if (!account) {
      NotificationManager.warning("Please connect to the wallet", "Warn");
      return;
    }

    if (!title) {
      NotificationManager.warning("Please input the title", "Warn");
      return;
    }
    
    if (!removeHtmlTags(body)) {
      NotificationManager.warning("Please input the text", "Warn");
      return;
    }

    dispatch(setLoading(true));
    const blog: IBlog = {
      Type: uuid ? "UPDATE_BLOG" : "ADD_BLOG",
      UUID: curBlog?.UUID || uuidv4(),
      Title: title,
      Body: body,
      Creator: account.toLowerCase(),
      BodyCID: ''
    };

    dispatch(createBlog(blog))
      .unwrap()
      .then((blog) => {
        // handle result here
        NotificationManager.success(`"${blog.Title}" ${uuid ? "Updated" : "Created"}`, "Blog Created");
        navigate("/main");
        console.log({ blog });
        dispatch(setLoading(false));
      })
      .catch((rejectedValueOrSerializedError) => {
        // handle error here
        console.log({ rejectedValueOrSerializedError });
        dispatch(setLoading(false));
      });
  };

  return (
    <div className="new-blog-page">
      <input
        className="title"
        type="text"
        placeholder="Title"
        onChange={(e: any) => setTitle(e.target.value)}
        value={title}
      />
      {/* <MediumEditor
        text={body || "<p></p>"}
        onChange={(text: any, medium: any) => { setBody(text); console.log({text, medium})}}
      /> */}
      <CodeMirror
        value={body}
        options={{
          lineNumbers: true,
          mode: 'markdown'
        }}
        onBeforeChange={(editor, data, value) => {
          setBody(value);
        }}
        onChange={(editor, data, value) => {}}
        className="newblog-editor"
      />
      <div className="submit">
        <Button variant="contained" color="success" onClick={onCreate}>
          {uuid ? "Update" : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default NewBlog;
