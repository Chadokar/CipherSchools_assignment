import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Profile from "./afterauth/Profile";
import Smoothies from "./afterauth/Smoothies";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./home/Home";
import Header from "./partials/Header";

function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/smoothies" element={<Smoothies />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default Navigation;
