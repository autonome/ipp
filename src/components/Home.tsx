import React from 'react';
import { useSelector } from 'react-redux';
import BlogComponent from './BlogComponent';

interface IHome {}

const Home = (props: IHome) => {
  const blogs = useSelector<any, IBlog[]>(state => state.db.Blogs) || [];

  return (
    <div className='home-page'>
      {blogs.map(blog => (<BlogComponent key={blog.CID} blog={blog} />))}
    </div>
  );
};

export default Home;
