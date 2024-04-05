import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../redux/user/userSlice.js";

const Register = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);

    try {
      setErrorMessage(null);
      dispatch(signUpStart());
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success === false) {
        setErrorMessage("User Couln't be Registered");
        toast.error(data.message);
        dispatch(signUpFailure(data.message));
        return;
      }
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      dispatch(signUpSuccess(data));
      toast.success(data.message);
      navigate("/?tab=profile");
    } catch (error) {
      dispatch(signUpFailure(data.message));
      setErrorMessage("User Couln't be Registered");
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="register">
      <div className="container">
        <h3 className="heading">Register</h3>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="number"
            placeholder="Enter Your Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button variant="warning" type="submit">
            Submit
          </button>
        </form>
        <div className="text mt-2">
          <p className="inline mr-2 text-[0.9rem]">Already Registered</p>
          <Link to={"/login"}>
            <span className="text-blue-600 hover:underline underline-offset-2">
              Login
            </span>
          </Link>
        </div>
        {errorMessage && (
          <p className="text-red-600 text-center text-[0.75rem]">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
