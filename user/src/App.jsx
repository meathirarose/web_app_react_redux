import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home"; 
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Error from "./components/Error";


const AppLayout = () => {
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path: '/',
    element : <AppLayout />,
    children: [
      {
        path : '/',
        element : <Home />
      },
      {
        path : '/sign-in',
        element : <SignIn />
      },
      {
        path : '/sign-up',
        element : <SignUp />
      },
      {
        path : '/profile',
        element : <Profile />
      }
    ],
    errorElement : <Error />
  }
])


export default function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}
