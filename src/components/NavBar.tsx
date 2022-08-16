import React from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface INavBar {}

const NavBar = (props: INavBar) => {
  const web3 = useSelector<any, any>((state) => state.web3.web3);
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );
  const chainId = useSelector<any, number | null>(
    (state) => state.web3.chainId
  );

  return (
    <div className="navbar">
      <div className="logo">
        <a href="/">
          <img
            src="/assets/images/logo.png"
            className="item-image"
            alt="Protocol Labs"
          />
        </a>
      </div>
      <div className="nav-items">
        <Link to="/main">
          <FaHome size={30} />
        </Link>
        {account && (
          <Link to="/main/new">
            <FaPlus size={30} />
          </Link>
        )}
      </div>
      <div className="user">
        {account && (
          <>
            <img
              src="/assets/images/user-avatar.png"
              className="item-image"
              alt="Annya"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
