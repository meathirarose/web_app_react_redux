import { useSelector } from "react-redux";

const AdminHome = () => {
  const { currentAdmin } = useSelector((state) => state.admin);  

  return (
    <div  className="text-center py-10 text-white">
      <h1>Admin Home</h1>
      {currentAdmin?.isAdmin ? (
        <p>Welcome, Admin!</p>
      ) : (
        <p>Welcome to the admin area. Please sign in to access more features.</p>
      )}
    </div>
  );
};

export default AdminHome;
