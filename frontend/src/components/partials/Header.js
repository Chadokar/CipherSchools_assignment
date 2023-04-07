import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const logouthandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    window.location.reload(true);
    navigate("/");
  };

  return (
    <>
      <nav className="main">
        <h1 className="name">
          <a href="/">Shubham Chadokar</a>
        </h1>
        <ul className="nav-right">
          {localStorage.getItem("userInfo") && (
            <li className="nav-right-btn" onClick={logouthandler}>
              <a href="/" className="btn">
                Log out
              </a>
            </li>
          )}
          {!localStorage.getItem("userInfo") && (
            <li className="nav-right-btn">
              <a href="/login">Log in</a>
            </li>
          )}
          {!localStorage.getItem("userInfo") && (
            <li className="nav-right-btn">
              <a href="/signup" className="btn">
                Sign up
              </a>
            </li>
          )}
          {localStorage.getItem("userInfo") && (
            <li className="nav-right-btn">
              <a href="/profile" className="btn profile-btn">
                {userInfo && userInfo.profileImage && (
                  <img src={userInfo.profileImage} alt="" />
                )}
                {!userInfo && (
                  <img
                    src={`https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`}
                    alt=""
                  />
                )}
              </a>
            </li>
          )}
        </ul>
      </nav>
      <Outlet />
      <Footer />
    </>
  );
}

export default Header;
