import { useContext, useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";

export default function Navbar() {
    const navigate = useNavigate()
    const path = useLocation().pathname
    const [toggle, setToggle] = useState(true)
    const { user, setUser } = useContext(UserContext)
    const [searchText, setSearchText] = useState("")
    const handleLogout = async () => {
        try {
            const response = await axios.post(URL + "/api/auth/logout", null, { withCredentials: true })
            setUser(null)
            toast.success(response.data.message)
            navigate("/login")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const handleSearch = (e) => {
        e.preventDefault()
        if (searchText) {
            navigate(`?search=${searchText}`);
        } else {
            navigate("/");
        }
    }
    return (
        <div className="flex justify-between  items-center bg-gray-900  shadow-2xl shadow-blue-50 text-white py-3 fixed w-full top-0  z-50" >
            <NavLink to={"/"} className={"basis-[30%]  md:text-center"}><h1 className="text-xl px-2 font-bold">BLOG MARKET</h1></NavLink>
            {path === "/" && <form onSubmit={handleSearch}
                className=" flex  items-center bg-white   basis-[40%]">
                <input type="search" placeholder="Search a title " value={searchText} onChange={(e) => setSearchText(e.target.value)}
                    className="outline-none w-full  text-black px-2 " />
                <button type="submit">
                    <i className="fa-solid fa-magnifying-glass text-xl hover:bg-gray-900 bg-white text-gray-900 hover:text-white  cursor-pointer border-gray-900 border-l-2 px-1 sma:px-3"></i>
                </button>
            </form>}
            <div className="basis-[30%] ml-3  ">
                <ToastContainer />
                {user ?
                    <div className="relative  flex flex-col items-end sm:items-center  ">
                        <div className="flex items-center  justify-center  ">
                            <p className="mx-2">{user.username} </p>
                            {toggle ? <i className="fa-solid fa-bars border-1    cursor-pointer  text-2xl text-center w-11 h-8  z-10 hover:border-l" onClick={() => setToggle(prev => !prev)}></i> :
                                <i className="fa-solid fa-xmark  border-1     cursor-pointer  text-2xl font-bold text-center w-11 h-8  z-10 hover:border-r" onClick={() => setToggle(prev => !prev)}></i>}
                        </div>
                        <div className={`flex flex-col sm:w-44  mt-10 right-0  items-start sm:items-center bg-gray-900 p-3  rounded-b-lg rounded-br-none absolute   *:text-start  *:p-2   *:w-24 * ${toggle ? "hidden" : "flex"} `}>
                            <NavLink to={"/write"} className={"hover:border-l"}>Write Blog</NavLink>
                            <NavLink to={"/myBlogs"} className={"hover:border-l"}>My Blogs</NavLink>
                            <NavLink to={"/profile/" + user.id} className={"hover:border-l"}>Profile</NavLink>
                            <NavLink onClick={handleLogout} className={"hover:border-l hover:text-white text-red-600"}>Logout</NavLink>
                        </div>
                    </div>
                    :
                    <div className={`flex   rounded-b-lg rounded-br-none  *:font-bold   *:text-center *:mx-1 *:md:mx-5 justify-end  md:justify-center`}>
                        <NavLink to={"/login"} className={"hover:border-b hover:border-red-700"}>Login</NavLink>
                        <NavLink to={"/register"} className={"hover:border-b hover:border-red-700 "}>Register</NavLink>
                    </div>
                }

            </div>
        </div>
    )
}
