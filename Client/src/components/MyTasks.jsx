import {
  Modal,
  Table,
  Button,
  Label,
  Textarea,
  TextInput,
  Card,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import { data } from "autoprefixer";
import toast from "react-hot-toast";

const MyTasks = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userTasks, setUserTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/task/mytasks",
          { withCredentials: true }
        );
        if (data.success === false) {
          toast.error(data.message);
          return;
        }
        setUserTasks(data.tasks);
        setAllTasks(data.tasks);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    if (currentUser.rest._id) {
      fetchPosts();
    }
  }, [currentUser.rest._id]);

  const handleDeleteTask = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/task/delete/${taskId}`,
        { withCredentials: true }
      );
      if (data.success === false) {
        toast.error(data.message);
      }
      setUserTasks((prevTasks) => {
        return prevTasks.filter((task) => task._id !== taskId);
      });
      setDeleteModal(false);
      setTaskId("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleTaskUpdates = (event) => {
    setUpdatedTask({ ...updatedTask, [event.target.id]: event.target.value });
  };

  const handleUpdateTask = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/task/update/${updatedTask._id}`,
        updatedTask,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (data.success === false) {
        toast.error(data.message);
      }
      toast.success(data.message);
      setUpdateModal(false);
      setUpdatedTask({ title: "", description: "", status: "" });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const filterTasks = (filterType) => {
    let filteredTasks = [];
    switch (filterType) {
      case "completed":
        filteredTasks = allTasks.filter((task) => task.status === "completed");
        break;
      case "incomplete":
        filteredTasks = allTasks.filter((task) => task.status === "incomplete");
        break;
      case "archived":
        filteredTasks = allTasks.filter((task) => task.status === "archived");
        break;
      case "all":
        filteredTasks = allTasks;
        break;
      default:
        filteredTasks = allTasks;
    }
    setUserTasks(filteredTasks);
  };

  return (
    <div className="userTasks table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="filterBtns">
        <button onClick={() => filterTasks("all")}>All Tasks</button>
        <button onClick={() => filterTasks("completed")}>
          Completed Tasks
        </button>
        <button onClick={() => filterTasks("incomplete")}>
          Incomplete Tasks
        </button>
        <button onClick={() => filterTasks("archived")}>Archived Tasks</button>
      </div>
      {currentUser && userTasks.length > 0 ? (
        <>
          <Table hoverable className="table shadow-md">
            <Table.Head className="tableHead">
              <Table.HeadCell className="title">Title</Table.HeadCell>
              <Table.HeadCell className="description">
                Description
              </Table.HeadCell>
              <Table.HeadCell className="status">Status</Table.HeadCell>
              <Table.HeadCell className="date">Date</Table.HeadCell>
              <Table.HeadCell className="update">Update</Table.HeadCell>
              <Table.HeadCell className="delete">Delete</Table.HeadCell>
            </Table.Head>
            {userTasks.map((task) => (
              <Table.Body className="tableBody divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="title">{task.title}</Table.Cell>
                  <Table.Cell className="description">
                    {task.description}
                  </Table.Cell>
                  <Table.Cell className="status">{task.status}</Table.Cell>
                  <Table.Cell className="date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="update">
                    <span
                      onClick={() => {
                        setUpdateModal(true);
                        setUpdatedTask(task);
                      }}
                    >
                      Update
                    </span>
                  </Table.Cell>
                  <Table.Cell className="delete">
                    <span
                      onClick={() => {
                        setDeleteModal(true);
                        setTaskId(task._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p className="text-slate-700 text-lg">No Tasks Found !</p>
      )}
      <Modal
        show={deleteModal}
        onClose={() => setDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto" />
            <h3 className="my-5 text-lg text-gray-500 dark:text-gray-400">
              Do You Really Want to Delete this Post
            </h3>
            <div className="flex justify-center gap-10">
              <Button color="failure" onClick={handleDeleteTask}>
                Yes, I'm Sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={updateModal}
        size="md"
        onClose={() => setUpdateModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 text-slate-700">
            <h3 className="text-2xl text-center dark:text-white">
              Update Task
            </h3>
            <div className="space-y-1">
              <Label value="Task Title" />
              <TextInput
                id="title"
                onChange={handleTaskUpdates}
                required
                value={updatedTask.title}
              />
            </div>
            <div className="space-y-1">
              <Label value="Task Description" />
              <Textarea
                id="description"
                type="text"
                required
                onChange={handleTaskUpdates}
                maxLength="200"
                rows="5"
                cols="50"
                className="w-full"
                value={updatedTask.description}
              />
            </div>
            <div className="space-x-2">
              <Label
                value="Task Status:"
                className="text-slate-700 font-medium"
              />
              <select
                id="status"
                onChange={handleTaskUpdates}
                className="rounded-md border-slate-700"
              >
                <option value="incomplete">Incomplete</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div className="w-full">
              <Button onClick={handleUpdateTask}>Update Task</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyTasks;
