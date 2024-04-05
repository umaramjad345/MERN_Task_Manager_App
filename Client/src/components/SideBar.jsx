import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { signOutSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import axios from "axios";

const SideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );

      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      dispatch(signOutSuccess());
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.rest.isAdmin && (
            <Link to="/?tab=info">
              <Sidebar.Item
                active={tab === "info" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Home
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.rest.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.rest.isAdmin ? (
            <Link to="/?tab=all-tasks">
              <Sidebar.Item
                active={tab === "all-tasks"}
                icon={HiDocumentText}
                as="div"
              >
                All Tasks
              </Sidebar.Item>
            </Link>
          ) : (
            <Link to="/?tab=my-tasks">
              <Sidebar.Item
                active={tab === "my-tasks"}
                icon={HiDocumentText}
                as="div"
              >
                My Tasks
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.rest.isAdmin && (
            <Link to="/?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            LogOut
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SideBar;
