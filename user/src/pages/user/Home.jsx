import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "../../redux/user/counterSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const count = useSelector((state)=>state.counter.value);

  return (
    <div className="text-center py-10">
      <h1>{currentUser ? `Hello, ${currentUser.username}` : "Hello,"}</h1>

      <p className="font-semibold py-5">
        {currentUser
          ? "Welcome to this web application!"
          : "Please sign in or sign up to access this web application."}
      </p>

      <div>
        <button className="bg-slate-400" onClick={()=>dispatch(increment())} >Increment</button>
        <h1>counter:{count}</h1>
        <button className="bg-slate-400" onClick={()=>dispatch(decrement())} >Decrement</button>
      </div>

    </div>
  );
};

export default Home;
