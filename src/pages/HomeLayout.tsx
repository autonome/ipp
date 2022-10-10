import React from "react";
import NavBar from "../components/NavBar";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SideBar from "components/SideBar";
import Home from "components/Home";
import NewBlog from "components/NewBlog";
import Profile from "components/Profile";
import MyBlogs from "components/MyBlogs";
import BlogReader from "components/BlogReader";

const routes: any[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'new',
    component: NewBlog,
  },
  {
    path: 'profile',
    component: Profile,
  },
  {
    path: 'myblogs',
    component: MyBlogs,
  },
  {
    path: 'blogs/:uuid',
    component: BlogReader,
  },
  {
    path: 'blogs/:uuid/edit',
    component: NewBlog,
  },
];

interface IHomeLayout {}

const HomeLayout = (props: IHomeLayout) => {
  return (
    <div className="home-layout">
      <NavBar />
      <div className="main-container">
        <Routes>
          {routes.map((e) => (
            <Route
              key={e.path}
              path={e.path}
              element={React.createElement(e.component)}
            />
          ))}
          <Route path="*" element={<Navigate to="/main" />} />
        </Routes>
      </div>
      <div className="side-container">
        <SideBar />
      </div>
    </div>
  );
};

export default HomeLayout;
