import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="text-center py-10">
      <h1>{currentUser ? `Hello, ${currentUser.username}` : "Hello,"}</h1>

      <p className="font-semibold py-5">
        {currentUser
          ? "Welcome to this web application!"
          : "Please sign in or sign up to access this web application."}
      </p>
    </div>
  );
};

export default Home;
