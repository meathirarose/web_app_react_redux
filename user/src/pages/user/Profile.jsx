import { useEffect, useRef, useState } from "react";
import { BACKGROUND_IMAGE_HEADER_LINK } from "../../utils/constants";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [image, setImage] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const handleImageUpload = async (image) => {
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
        console.log("Upload is " + progress + "% done");
      },

      (error) => {
        setImageError(true);
        console.error("Upload failed:", error);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="p-10
       max-w-lg mx-auto my-8 bg-slate-50 rounded-lg shadow-md bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_HEADER_LINK})` }}
    >
      <h1 className="text-3xl text-center font-bold my-3">Profile</h1>

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="Profile Picture"
          className="h-24 w-24 rounded-full object-cover my-2 cursor-pointer "
          onClick={() => fileRef.current.click()}
        />

        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-slate-700">{`Uploading ${progress}% done.`}</span>
          ) : progress === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          defaultValue={currentUser.username}
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleInputChange}
        />

        <input
          defaultValue={currentUser.email}
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleInputChange}
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleInputChange}
        />

        <button className="bg-sky-600 rounded-lg p-2 w-full hover:bg-sky-500 disabled:opacity-95 uppercase text-white">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between w-96 mt-3">
        <span
          onClick={handleDeleteAccount}
          className="text-red-600 cursor-pointer text-sm font-semibold"
        >
          Delete Account?
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer text-sm font-semibold"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-600 mt-2 text-center">
        {error && "Something went wrong!"}
      </p>
      <p className="text-green-600 mt-2 text-center">
        {updateSuccess && "User updated successfully!"}
      </p>
    </div>
  );
};

export default Profile;
