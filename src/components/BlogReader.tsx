import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MarkdownIt from "markdown-it";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";

interface IBlogReader {}

const md = new MarkdownIt();

const BlogReader = (props: IBlogReader) => {
  const users = useSelector<any, { [key: string]: IUser }>(
    (state) => state.db.Users
  );
  const blogs = useSelector<any, IBlog[]>((state) => state.db.Blogs);
  const { uuid } = useParams();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );

  const [blog, setBlog] = useState<IBlog | undefined>(undefined);

  useEffect(() => {
    const blog1 = blogs.find((b) => b.UUID === uuid);
    setBlog(blog1);
  }, [blogs, uuid]);

  const onEdit = () => {};

  return (
    <div className="blog-reader">
      <h1 className="blog-title">{blog?.Title}</h1>
      <div
        className="blog-body"
        // dangerouslySetInnerHTML={{ __html: md.render(blog?.Body || "") }}
      >
        {blog?.Body || ""}
      </div>
      {blog?.Creator === account && (
        <div className="buttons">
          <Link to={`/main/blogs/${blog.UUID}/edit`}>
            <Button variant="contained" color="success" onClick={onEdit}>
              Edit
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogReader;
