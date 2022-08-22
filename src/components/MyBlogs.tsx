import React from "react";
import { useSelector } from "react-redux";
import BlogComponent from "./BlogComponent";

interface IMyBlogs {}

const MyBlogs = (props: IMyBlogs) => {
  const blogs = useSelector<any, IBlog[]>((state) => state.db.Blogs) || [];
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );

  return (
    <div className="myblogs-page">
      <h2>My Blogs</h2>
      <div className="blogs-body">
        {blogs
          .filter((blog) => blog.Creator === account)
          .map((blog) => (
            <BlogComponent key={blog.CID} blog={blog} />
          ))}
      </div>
    </div>
  );
};

export default MyBlogs;
