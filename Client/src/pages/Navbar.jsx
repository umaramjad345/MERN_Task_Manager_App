import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

const Navbar = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/task/mytask",
          { withCredentials: true }
        );
        setAllTasks(data.tasks);
        setTasks(data.tasks);
      } catch (error) {
        console.log("Error in Fetching the Tasks");
      }
    };
    if (currentUser) {
      // fetchTasks();
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      dispatch(signOutSuccess());
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const filterTasks = (filterType) => {
    let filteredTasks = [];
    switch (filterType) {
      case "completed":
        filteredTasks = allTasks.filter((task) => task.status === "completed");
        setTaskTitle("Completed Tasks");
        break;
      case "incomplete":
        filteredTasks = allTasks.filter((task) => task.status === "incomplete");
        setTaskTitle("Incomplete Tasks");
        break;
      case "archived":
        filteredTasks = allTasks.filter((task) => task.status === "archived");
        setTaskTitle("Archived Tasks");
        break;
      case "all":
        filteredTasks = allTasks;
        setTaskTitle("All Tasks");
        break;
      default:
        filteredTasks = allTasks;
    }
    setTasks(filteredTasks);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>Task Manager</h1>
        <div className="account">
          {currentUser && (
            <Link to={"/?tab=profile"}>
              <img
                src={currentUser.rest.avatar.url}
                className="w-10 rounded-full"
              />
            </Link>
          )}
          {currentUser ? (
            <button className="navBtn" onClick={handleSignOut}>
              LogOut
            </button>
          ) : (
            <Link to={"/login"}>
              <button className="navBtn">LogIn</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
