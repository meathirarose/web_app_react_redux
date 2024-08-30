import { BACKGROUND_IMAGE_HEADER_LINK } from "../utils/constants";
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <div 
      className="p-10
       max-w-lg mx-auto my-8 bg-slate-50 rounded-lg shadow-md bg-cover bg-center flex flex-col items-center" 
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_HEADER_LINK})` }}
      >
      <h1 className="text-3xl text-center font-bold my-3">Profile</h1>
      
      <form className="flex flex-col items-center gap-4">
        <img 
          src={currentUser.profilePicture} 
          alt="Profile Picture" 
          className="h-24 w-24 rounded-full object-cover my-2 cursor-pointer " 
        />
        
        <input
          defaultValue={currentUser.username}
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"  
        />

        <input
          defaultValue={currentUser.email}
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"  
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"  
        />

        <button className="bg-sky-600 rounded-lg p-2 w-full hover:bg-sky-500 disabled:opacity-95 uppercase text-white">
          Update
        </button>

      </form>
      <div className="flex justify-between w-96 mt-3">  
          <span className="text-red-600 cursor-pointer text-sm font-semibold">Delete Account?</span>
          <span className="text-red-600 cursor-pointer text-sm font-semibold">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
