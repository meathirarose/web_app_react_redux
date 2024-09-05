import { Link } from "react-router-dom";
import { LOGO_LINK } from "../utils/constants";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className={`${isAdminPage ? "text-white" : " text-black"} shadow-2xl`}>
      <div className="flex justify-between m-auto items-center p-7 max-w-6xl">
        <img src={LOGO_LINK} alt="logo-image" className="w-16 cursor-pointer" />
        <ul className="flex gap-4">
          <li className="px-2 mx-4">
            {isAdminPage ? (
              <Link to="/admin">Home</Link>
            ) : (
              <Link to="/">Home</Link>
            )}
          </li>
          <li className="px-2 mx-4">
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.profilePicture}
                  alt="Profile Picture"
                  className="h-7 w-7 rounded-full object-cover"
                />
              </Link>
            ) : isAdminPage ? (
              <Link to="/admin/sign-in">Sign In</Link>
            ) : (
              <Link to="/sign-in">Sign In</Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
