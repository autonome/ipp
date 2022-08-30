import React from "react";
import Avatar from 'react-avatar';
import { useSelector } from "react-redux";
import { getW3link, removeHtmlTags } from "utils/helper";
import MarkdownIt from 'markdown-it' ;
import { Link } from "react-router-dom";

interface IBlogComponent {
  blog: IBlog;
}

const md = new MarkdownIt();

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
      <Link className="blog-body" to={`/main/blogs/${blog.UUID}`}>
        {removeHtmlTags(md.render(blog.Body))}
      </Link>
    </div>
  );
};

export default BlogComponent;
