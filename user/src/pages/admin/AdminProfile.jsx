import { useSelector } from "react-redux";

const AdminProfile = () => {
  const { currentAdmin } = useSelector((state) => state.admin);

  return (
    <div className="p-10 max-w-lg mx-auto my-20 rounded-lg shadow-2xl bg-cover bg-center flex flex-col items-center gap-6">
      <h1 className="text-3xl text-center font-bold my-3 ">Admin Profile</h1>
      <form className="flex flex-col items-center gap-6">
        <input
          disabled
          defaultValue={currentAdmin.username}
          type="text"
          placeholder="Username"
          id="username"
          className=" p-2 w-96 rounded-lg text-gray-900"
        />
        <input
          disabled
          defaultValue={currentAdmin.email}
          type="email"
          placeholder="Email"
          id="email"
          className=" p-2 w-96 rounded-lg text-gray-900"
        />
      </form>
      <div>
        <span className="text-red-600 cursor-pointer text-sm font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default AdminProfile;
