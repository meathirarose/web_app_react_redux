import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKGROUND_IMAGE_LINK } from "../utils/constants";

const SignIn = () => {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
      setFormData({
        ...formData, 
        [e.target.id] : e.target.value
      })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(true);
        return;
      }
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(false);
      console.log(error);
    }
  }

  return (
    <div className="p-12 max-w-lg mx-auto my-10 bg-slate-50 rounded-lg shadow-md bg-cover bg-center" 
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_LINK})` }}>
      <h1 className="text-3xl text-center font-bold my-7">Sign In</h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleInputChange}
        />
        <button disabled={loading} className="bg-slate-500 text-white rounded-lg p-3 hover:opacity-60 disabled:opacity-95 uppercase">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <div className="flex gap-2 mt-2">
        <p>Do not have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-400 ">Sign Up</span>
        </Link>
      </div>
      <p className="text-red-600 mt-2 text-center">{error && "Something went wrong!"}</p>
    </div>
  );
};

export default SignIn;
