import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKGROUND_IMAGE_LINK } from "../../utils/constants";
import { toast } from 'react-toastify';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(data.message || 'Failed to sign up');
        return;
      }
      toast.success('Signed up successfully! Redirecting...');
      setTimeout(() => {
        navigate('/sign-in');
      }, 800);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Something went wrong!');
    }
  };

  return (
    <div className="p-12 max-w-lg mx-auto my-10 bg-slate-50 rounded-lg shadow-md bg-cover bg-center" 
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_LINK})` }}>

      <h1 className="text-3xl text-center font-bold my-7">Sign Up</h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleInputChange}
        />
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>

      <div className="flex gap-2 mt-2">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-400">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
