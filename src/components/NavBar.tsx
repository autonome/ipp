import React from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { disconnectWallet } from 'slices/web3Slice';
import { AppDispatch } from 'slices/store';

interface INavBar {}

const NavBar = (props: INavBar) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector<any, string | null>(
    (state) => state.web3.selectedAddress
  );

  // user account dropdown actions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(disconnectWallet());
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/main/profile');
    setAnchorEl(null);
  };

  const handleMyBlogs = () => {
    navigate('/main/myblogs');
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <a href="/">
          <img
            src="/logo.png"
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
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              style={{
                minWidth: 'unset'
              }}
            >
              <img
                src="/user-avatar.png"
                className="item-image"
                alt="Annya"
              />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleMyBlogs}>My Blogs</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
