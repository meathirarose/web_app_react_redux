import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/user/Home";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import Profile from "./pages/user/Profile";
import AdminSignIn from './pages/admin/AdminSignIn';
import AdminHome from "./pages/admin/adminHome";
import Header from "./components/Header";
import Error from "./components/Error";
import PrivateRoute from "./components/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import { useLocation } from "react-router-dom";
import { HOME_BACKGROUND_IMAGE_LINK, ADMIN_BACKGROUND_IMAGE_LINK } from "./utils/constants";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEditUser from "./pages/admin/AdminEditUser";
import AdminAddNewUser from "./pages/admin/AdminAddNewUser";

const AppLayout = () => {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div
      className="app min-h-screen bg-gray-100 text-gray-800 font-sans relative"
      style={{
        backgroundImage: `url(${isAdminPage ? ADMIN_BACKGROUND_IMAGE_LINK: HOME_BACKGROUND_IMAGE_LINK})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        opacity: isAdminPage ? 0.90 : 1
      }}
    >
      <Header />
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: <AdminHome />, 
      },
      {
        path: "/admin/sign-in",
        element: <AdminSignIn />, 
      },
      {
        path: "/admin/profile",
        element: <AdminProfile />
      },
      {
        path:"/admin/dashboard",
        element: <PrivateAdminRoute isAdmin={true}>
          <AdminDashboard />
        </PrivateAdminRoute>
      },
      {
        path: "/admin/edit-user/:userId",
        element: <AdminEditUser />
      },
      {
        path: "/admin/add-new-user",
        element: <AdminAddNewUser />
      },
    ],
    errorElement: <Error />,
  },
]);


export default function App() {
  return <RouterProvider router={appRouter} />;
}
