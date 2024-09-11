import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminEditUser = () => {

    const {userId} = useParams();
    console.log(userId);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(data);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/admin/fetchUserData/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
          })
          if(!res.ok){
            throw new Error("Failed to fetch user data");
          }

          const data = await res.json();
          setData(data);
        } catch (error) {
          setError(error.message)
        }finally{
          setLoading(false);
        }
      }
      fetchUserData();
    }, [userId])

    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }  

    return (
        <div
          className="p-10
           max-w-lg mx-auto my-8 rounded-lg shadow-2xl bg-cover bg-center flex flex-col items-center"
        >
          <h1 className="text-3xl text-center font-bold my-3">Edit User</h1>
    
          <form
            className="flex flex-col items-center gap-4"
          >
            <input
              type="file"
              hidden
              accept="image/*"
            />
            <img
              src={data.profilePicture}
              alt="Profile Picture"
              className="h-24 w-24 rounded-full object-cover my-2 cursor-pointer "
            />
    
            <p className="text-sm self-center"></p>
    
            <input
              defaultValue={data.username}
              type="text"
              placeholder="Username"
              id="username"
              className="bg-slate-100 p-2 w-96 rounded-lg text-gray-500"
            />
    
            <input
              defaultValue={data.email}
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
          <p className="text-red-600 mt-2 text-center">
          </p>
          <p className="text-green-600 mt-2 text-center">
          </p>
        </div>
      );
}

export default AdminEditUser
