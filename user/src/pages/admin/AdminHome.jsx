import { useSelector } from "react-redux";

const AdminHome = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div  className="text-center py-10 text-white">
      <h1>Admin Home</h1>
      {currentUser?.isAdmin ? (
        <p>Welcome, Admin!</p>
      ) : (
        <p>Welcome to the admin area. Please sign in to access more features.</p>
      )}
    </div>
  );
};

export default AdminHome;
