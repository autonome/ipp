import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MarkdownIt from 'markdown-it' ;
import { useParams } from "react-router-dom";

interface IBlogReader {
}

const md = new MarkdownIt();

const BlogReader = (props: IBlogReader) => {
  const users = useSelector<any, { [key: string]: IUser; }>((state) => state.db.Users);
  const blogs = useSelector<any, IBlog[]>((state) => state.db.Blogs);
  const {uuid} = useParams();

  const [blog, setBlog] = useState<IBlog | undefined>(undefined);

  useEffect(() => {
    const blog1 = blogs.find(b => b.UUID === uuid);
    setBlog(blog1);
  }, [blogs, uuid])
  

  return (
    <div className="blog-reader">
      <h1 className="blog-title">{blog?.Title}</h1>
      <div className="blog-body" dangerouslySetInnerHTML={{__html: md.render(blog?.Body || "")}} />
    </div>
  );
};

export default BlogReader;
