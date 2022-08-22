import React from "react";
import Avatar from 'react-avatar';

interface IBlogComponent {
  blog: IBlog;
}

const BlogComponent = (props: IBlogComponent) => {
  const { blog } = props;

  return (
    <div className="blog-item">
      <div className="user">
        <Avatar name="Foo Bar" size="30px" round={true} />
        <div className="name">{blog.Creator}</div>
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
