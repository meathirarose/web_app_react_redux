import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const { currentAdmin } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="text-center py-10 text-gray-300">
      <h1 className="text-2xl font-bold my-8">Admin Home</h1>
      {currentAdmin?.isAdmin ? (
        <div className="my-8">
          <p className="my-1">
            Welcome, <span className="text-gray-800 font-bold">Admin!</span>
          </p>
          <button
            onClick={handleDashboard}
            className="mt-4 text-blue-700 bg-slate-300 hover:text-blue-900 font-bold py-2 px-4 rounded-lg"
          >
            Go to Admin Dashboard
            <span className="mr-2 ml-2">→</span>
          </button>
        </div>
      ) : (
        <p>
          Welcome to the admin area. Please sign in to access more features.
        </p>
      )}
    </div>
  );
};

export default AdminHome;
