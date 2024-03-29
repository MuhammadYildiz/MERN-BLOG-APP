import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useContext, useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import {Helmet} from "react-helmet";
export default function Register() {
    const navigate = useNavigate()
    const {setUser} = useContext(UserContext)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(URL + "/api/auth/register", { username, email, password },{withCredentials:true})
            const data = response.data.savedNewUser
            setUser(data)
            navigate("/")
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <div className="flex justify-around items-center bg-gray-900 shadow-2xl shadow-blue-50 text-white py-5 fixed w-full top-0 " >
            <Helmet><title>Register</title></Helmet>
                <NavLink to={"/"}><h1 className="text-2xl">BLOG MARKET</h1></NavLink>
                <div className="*:mx-2  *:border-2 *:px-3 *:py-2 *:rounded-lg w-[100px] ">
                    <NavLink to={"/login"} className={"[&.active]:border-red-700 w-[100px] "}>Login</NavLink>
                </div>
            </div>
            <div className="pt-28 w-full flex justify-center items-center h-[87dvh] bg-blue-100">
                <form onSubmit={handleRegister}
                    className="flex flex-col justify-around w-[320px] p-10 h-[400px] shadow-2xl shadow-black rounded-lg bg-white">
                    <h1 className="text-2xl  font-bold text-center">Register</h1>
                    <div className="flex flex-col justify-between items-start">
                        <label htmlFor="" className="font-bold my-1">User Name:</label>
                        <input type="text" placeholder="User Name:" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="outline-none border-2 w-full border-gray-900 py-1 px-3 rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col justify-between items-start">
                        <label htmlFor="" className="font-bold my-1">Email:</label>
                        <input type="email" placeholder="Email:" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="outline-none border-2 w-full border-gray-900 py-1 px-3 rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col justify-between items-start">
                        <label htmlFor="" className="font-bold my-1">Password:</label>
                        <span className=" border-2 w-full border-gray-900 py-1 px-3 rounded-lg flex items-center">
                            <input type={showPass ? "text" : "password"} autoComplete="" placeholder="Password:" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="outline-none  w-[90%]"
                            />
                            {showPass ? <i className="fa-solid fa-eye cursor-pointer"
                                onClick={() => setShowPass(prev => !prev)} ></i>
                                :
                                <i className="fa-solid fa-eye-slash cursor-pointer"
                                    onClick={() => setShowPass(prev => !prev)}  ></i>}
                        </span>
                    </div>
                    <div className="w-full text-center">
                        <ToastContainer/>
                        <button type="submit" className="bg-gray-900 text-white px-3 py-1 font-bold rounded-lg hover:bg-gray-700 m-3">Register</button>
                        <p>Have an account ?
                            <NavLink to={"/login"} className={"text-red-700 hover:underline mx-2"}>Login</NavLink>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}
