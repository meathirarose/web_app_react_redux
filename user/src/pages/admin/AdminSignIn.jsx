import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  resetError,
} from "../../redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.admin);

  useEffect(()=>{
    dispatch(resetError())
  }, [dispatch])

  const handleChange = (e) => {

    if(error){
      dispatch(resetError());
    }

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/admin/sign-in", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      if (data.isAdmin !== 1) {
        dispatch(
          signInFailure({ message: "Not authorized to access admin panel" })
        );
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/admin");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-12 max-w-lg mx-auto my-10 rounded-lg shadow-2xl bg-cover bg-center">
      <h1 className="text-3xl text-center font-bold my-7">Admin SignIn</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-60 disabled:opacity-95 uppercase"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <p className="text-red-600 mt-2 text-center">
        {error ? error.message || error || "Something went wrong!" : ""}
      </p>
    </div>
  );
};

export default AdminSignIn;
