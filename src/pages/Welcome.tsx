import { Button } from "@mui/material";
import Footer from "components/Footer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { connectWallet, disconnectWallet } from "slices/web3Slice";
import { AppDispatch } from "slices/store";
import { trimAddress } from "utils/helper";
import BlogComponent from "components/BlogComponent";

interface IWelcome {}

const Welcome = (props: IWelcome) => {
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );
  const blogs = useSelector<any, IBlog[]>((state) => state.db.Blogs) || [];

  const onConnect = () => {
    dispatch(account ? disconnectWallet() : connectWallet());
  };

  return (
    <div className="welcome-page">
      <div className="banner">
        <div className="overlay">
          <h1>IPP Blog</h1>
          <div className="description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
          <div className="go-container">
            <Link to="/main" className="btn-welcome">
              Go
            </Link>
            <Button className="btn-welcome" onClick={onConnect}>
              {account ? trimAddress(account) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
      <div className="body">
        <h2>Trending</h2>
        {blogs.map((blog) => (
          <BlogComponent key={blog.CID} blog={blog} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Welcome;
