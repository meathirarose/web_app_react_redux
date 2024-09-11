import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';

const AdminAddNewUser = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

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
            toast.error("Error uploading image");
            console.error("Upload failed:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData((prevData) => ({
                ...prevData,
                profilePicture: downloadURL,
              }));
              toast.success("Image uploaded successfully");
            });
          }
        );
      };
      handleImageUpload();
    }
  }, [image]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error adding user');
      console.error('Error adding user:', err);
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto my-8 rounded-lg shadow-2xl bg-cover bg-center flex flex-col items-center">
      <h1 className="text-3xl text-center font-bold my-3">Add New User</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture}
          alt="Profile Picture"
          className="h-24 w-24 rounded-full object-cover my-2 cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {progress > 0 && progress < 100 ? (
            <span className="text-slate-700">{`Uploading ${progress}% done.`}</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
          onChange={handleInputChange}
        />
        <input
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
        <button type="submit" className="bg-sky-600 rounded-lg p-2 w-full hover:bg-sky-500 disabled:opacity-95 uppercase text-white">
          Add
        </button>
      </form>
    </div>
  );
};

export default AdminAddNewUser;
