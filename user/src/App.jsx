import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Error from "./components/Error";
import PrivateRoute from "./components/PrivateRoute";
import { HOME_BACKGROUND_IMAGE_LINK } from "./utils/constants";

const AppLayout = () => {
  return (
    <div
      className="app min-h-screen bg-gray-100 text-gray-800 font-sans relative"
      style={{
        backgroundImage: `url(${HOME_BACKGROUND_IMAGE_LINK})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
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
    ],
    errorElement: <Error />,
  },
]);

export default function App() {
  return <RouterProvider router={appRouter} />;
}
