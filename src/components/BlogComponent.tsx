import React from "react";
import Avatar from 'react-avatar';
import { useSelector } from "react-redux";
import { getW3link } from "utils/helper";

interface IBlogComponent {
  blog: IBlog;
}

const BlogComponent = (props: IBlogComponent) => {
  const { blog } = props;
  const users = useSelector<any, { [key: string]: IUser; }>((state) => state.db.Users);

  return (
    <div className="blog-item">
      <div className="user">
        <Avatar name={users[blog.Creator]?.Name || "Unnamed"} size="30px" round={true} src={!!(users[blog.Creator]?.Image) ? getW3link(users[blog.Creator]?.Image || "") : ''} />
        <div className="name" title={blog.Creator}>{users[blog.Creator]?.Name || blog.Creator}</div>
        <div className="date">{blog.Date?.toLocaleString() || ""}</div>
      </div>
      <h3 className="blog-title">{blog.Title}</h3>
      <div
        className="blog-body"
        dangerouslySetInnerHTML={{ __html: blog.Body }}
      />
    </div>
  );
};

export default BlogComponent;
