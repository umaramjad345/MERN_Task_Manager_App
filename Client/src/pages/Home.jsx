import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import Profile from "../components/Profile.jsx";
import MyTasks from "../components/MyTasks.jsx";
import SideBar from "../components/SideBar.jsx";
import AllTasks from "../components/AllTasks.jsx";
import AllUsers from "../components/AllUsers.jsx";

const Home = () => {
  const location = useLocation();
  // console.log(location);
  // Output: { pathname: '/current-path', search: '?query=param', hash: '#hash', state: { someState } }
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");

    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  return (
    <div className="home min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <SideBar />
      </div>
      {tab === "profile" && <Profile />}
      {tab === "all-tasks" && <AllTasks />}
      {tab === "my-tasks" && <MyTasks />}
      {tab === "users" && <AllUsers />}
    </div>
  );
};

export default Home;
