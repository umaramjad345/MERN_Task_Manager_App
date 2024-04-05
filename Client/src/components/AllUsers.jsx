import {
  Modal,
  Table,
  Button,
  Label,
  Textarea,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";

const AllUsers = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/all-users",
          { withCredentials: true }
        );
        if (data.success === false) {
          toast.error(data.message);
          return;
        }
        setUsers(data.users);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    if (currentUser.rest._id) {
      fetchPosts();
    }
  }, [currentUser.rest._id]);

  const handleDeleteUser = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${userId}`,
        { withCredentials: true }
      );
      if (data.success === false) {
        toast.error(data.message);
      }
      setUsers((prevUsers) => {
        return prevUsers.filter((user) => user._id !== userId);
      });
      setDeleteModal(false);
      setUserId("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="userTasks table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Profile</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.avatar.url}
                      alt=""
                      className="w-12 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setDeleteModal(true);
                        setUserId(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
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
        <p className="text-slate-700 text-lg">No User Found !</p>
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
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm Sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllUsers;
