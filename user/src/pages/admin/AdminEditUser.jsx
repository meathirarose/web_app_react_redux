import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  fetchUserDataStart,
  fetchUserDataSuccess,
  fetchUserDataFailure,
} from "../../redux/admin/adminSlice";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from 'react-toastify'; 

const AdminEditUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const imageRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    dispatch(fetchUserDataStart());
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/admin/fetchUserData/${userId}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json" 
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const userData = await res.json();
        setData(userData);
        dispatch(fetchUserDataSuccess(userData));
      } catch (error) {
        setError(error.message);
        dispatch(fetchUserDataFailure(error.message));
        toast.error(`Error: ${error.message}`); 
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch, userId]);

  useEffect(() => {
    if (image) {
      const handleImageUpload = async () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(progress));
          },
          (error) => {
            setImageError(true);
            console.error("Upload failed:", error);
            toast.error(`Image upload failed: ${error.message}`); 
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setData((prevData) => ({
                ...prevData,
                profilePicture: downloadURL,
              }));
            });
          }
        );
      };
      handleImageUpload();
    }
  }, [image]);

  const handleEditChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/admin/updateUser/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: "include", 
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success === false) {
        dispatch(updateUserFailure(result));
        toast.error(`Update failed: ${result.message}`); 
        return;
      }
            
      dispatch(updateUserSuccess(result));
      toast.success("User updated successfully!"); 
      navigate('/admin/dashboard');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(`Update failed: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-10 max-w-lg mx-auto my-8 rounded-lg shadow-2xl bg-cover bg-center flex flex-col items-center">
      <h1 className="text-3xl text-center font-bold my-3">Edit User</h1>
      
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="file"
          ref={imageRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={data.profilePicture}
          alt="Profile Picture"
          className="h-24 w-24 rounded-full object-cover my-2 cursor-pointer"
          onClick={() => imageRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-slate-700">{`Uploading ${progress}% done.`}</span>
          ) : progress === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={data.username}
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleEditChange}
        />
        <input
          defaultValue={data.email}
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleEditChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleEditChange}
        />
        <button className="bg-sky-600 rounded-lg p-2 w-full hover:bg-sky-500 disabled:opacity-95 uppercase text-white">
          Update
        </button>
      </form>

    </div>
  );
};

export default AdminEditUser;
