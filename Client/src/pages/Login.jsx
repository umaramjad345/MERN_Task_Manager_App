import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

const Login = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      setEmail("");
      setPassword("");
      dispatch(signInSuccess(data));
      toast.success(data.message);
      navigate("/?tab=profile");
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <h3 className="heading">LogIn</h3>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">{loading ? "Loading..." : "Submit"}</button>
        </form>
        <div className="text mt-2">
          <p className="inline mr-2 text-[0.9rem]">Don't Have an Account</p>
          <Link to={"/register"}>
            <span className="text-blue-600 hover:underline underline-offset-2">
              Register
            </span>
          </Link>
        </div>
        {error && (
          <p className="text-red-600 text-center text-[0.75rem]">{error}</p>
        )}
      </div>
    </div>
  );
};
export default Login;
