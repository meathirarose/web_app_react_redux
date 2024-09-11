import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AdminDashboard = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/getUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch, users]);

  const handleAddUser = () => {
    navigate('/admin/add-new-user');
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/edit-user/${userId}`)
  }

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
  
    try {
      dispatch(deleteUserStart());
  
      const res = await fetch(`/api/admin/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
     if (!res.ok) {
        const errorData = await res.json();
        dispatch(deleteUserFailure(errorData));
        toast.error("Failed to delete user: " + (errorData.message || 'Unknown error'));
        return;
      }
  
      const data = await res.json();
      console.log("data is coming ----", data);
  
      dispatch(deleteUserSuccess(userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error occurred while deleting user:", error);
      dispatch(deleteUserFailure(error));
      toast.error("An error occurred while deleting the user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-4 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6 mx-4">
        <h1 className="text-2xl font-bold mb-4 text-white text-center ">
          Admin Dashboard - User List
        </h1>
        <div className="flex justify-end">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white my-3 py-2 px-4 rounded-lg transition-colors"
          >
            <FaPlus /> Add New User
          </button>
        </div>
        {users.length > 0 ? (
          <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Profile Picture</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <td className="border-t border-gray-700 py-3 px-6">
                    {index + 1}
                  </td>
                  <td className="border-t border-gray-700 py-3 px-6">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="border-t border-gray-700 py-3 px-6">
                    {user.username}
                  </td>
                  <td className="border-t border-gray-700 py-3 px-6">
                    {user.email}
                  </td>
                  <td className="border-t border-gray-700 py-3 px-6 flex justify-center gap-2">
                    <button onClick={() => handleEditUser(user._id)} className="text-blue-400 hover:text-blue-300">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-white">No users found</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
