import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./pages/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./App.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              width: "300px",
              height: "60px",
              fontSize: "1rem",
              border: "2px solid rgb(97, 89, 136)",
              padding: "16px",
            },
            success: {
              style: {
                color: "#fff",
                background: "rgb(97, 89, 136)",
              },
            },
            error: {
              style: {
                color: "rgb(97, 89, 136)",
                background: "#fff",
              },
            },
          }}
        />
      </BrowserRouter>
    </>
  );
};

export default App;
