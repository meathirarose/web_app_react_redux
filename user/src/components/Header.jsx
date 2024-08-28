import { Link } from "react-router-dom"

const Header = () => {
  return (
    <div className="bg-gray-300 shadow-lg">
      <div className="flex justify-between m-auto items-center p-7 max-w-6xl">
        <h1 className="font-bold">WEB APP</h1>
        <ul className="flex gap-4">
          <li className="px-2 mx-4"><Link to={"/"} >Home</Link></li>
          <li className="px-2 mx-4"><Link to={"/sign-in"} >Sign In</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Header
