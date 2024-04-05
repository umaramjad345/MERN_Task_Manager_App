import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../redux/user/userSlice.js";
import toast from "react-hot-toast";
import { Button, Modal, Label, TextInput, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRef = useRef();

  let [formData, setFormData] = useState({});
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [customError, setCustomError] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openTaskModel, setOpenTaskModal] = useState(false);
  const [task, setTask] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleAvatar = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatar(file);
      setDocAvatarPreview(reader.result);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCustomError(null);
    formData = { ...formData, avatar: docAvatar };
    console.log(formData);
    if (Object.keys(formData).length === 0) {
      setCustomError("No Changes Made");
      return;
    }
    try {
      dispatch(updateStart());

      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/update/${currentUser.rest._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        setCustomError("User Couldn't be Updated");
        return;
      }
      dispatch(updateSuccess(data));
      toast.success(data.message);
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
      setCustomError("User Couldn't be Updated");
      toast.error(error.response.data.message);
    }
  };

  const handleTaskChange = (event) => {
    setTask({ ...task, [event.target.id]: event.target.value });
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/task/create",
        task,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (data.success === false) {
        setCustomError("Task Couln't be Created");
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setOpenTaskModal(false);
    } catch (error) {
      setCustomError("Task Couln't be Created");
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${currentUser.rest._id}`,
        { withCredentials: true }
      );
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      dispatch(deleteUserFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

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

  return (
    <div className="profile">
      <h3 className="heading">Profile</h3>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatar}
            ref={userRef}
            hidden
          />
          <img
            src={docAvatarPreview || currentUser.rest.avatar.url}
            alt=""
            className="rounded-full w-32"
            onClick={() => userRef.current.click()}
          />
        </div>
        <input
          type="text"
          id="name"
          defaultValue={currentUser.rest.name}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.rest.email}
          onChange={handleChange}
        />
        <input
          type="number"
          id="phone"
          defaultValue={currentUser.rest.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Change Password"
          id="password"
          onChange={handleChange}
        />
        <button type="submit" className="submitBtn">
          Update
        </button>
      </form>
      <div className="w-full mt-4 text-slate-700">
        <button className="submitBtn" onClick={() => setOpenTaskModal(true)}>
          Create Task
        </button>
      </div>

      <div className="text mt-2">
        <span
          className="cursor-pointer hover:underline underline-offset-2"
          onClick={() => setOpenDeleteModal(true)}
        >
          Delete Account
        </span>
        <span
          className="cursor-pointer hover:underline underline-offset-2"
          onClick={handleSignOut}
        >
          LogOut
        </span>
      </div>
      <Modal
        show={openTaskModel}
        size="md"
        onClose={() => setOpenTaskModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 text-slate-700">
            <h3 className="text-2xl text-center dark:text-white">
              Create Task
            </h3>
            <div>
              <Label value="Task Title" />
              <TextInput id="title" onChange={handleTaskChange} required />
            </div>
            <div>
              <Label value="Your password" />
              <Textarea
                id="description"
                type="text"
                required
                onChange={handleTaskChange}
                maxLength="200"
                rows="5"
                cols="50"
                className="w-full"
              />
            </div>
            <div className="w-full">
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="my-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Do You Really Want to Delete Your Account
            </h3>
            <div className="flex justify-center gap-10">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm Sure
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {customError && <p className="text-red-600 text-center">{customError}</p>}
    </div>
  );
};

export default Profile;
