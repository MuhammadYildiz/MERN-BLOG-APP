import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfilePosts from "../components/ProfilePosts";
import axios from 'axios';
import { URL } from '../url';
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    const params = useParams().id;
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const response = await axios.get(URL + "/api/users/" + params);
            const userData = response.data.user;
            if (userData) {
                setUsername(userData.username);
                setEmail(userData.email);
            } else {
                console.error("User data is undefined");
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchProfile();
    }, [params, user]);

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(URL + "/api/users/" + params, {
                username,
                email,
            }, { withCredentials: true });
            // Update the user context with the new information
            console.log(response.data.updatedUser);
            toast.success(response.data.message);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };


    const handleUserDelete = async () => {
        try {
            const response = await axios.delete(URL + "/api/users/" + params, { withCredentials: true });
            toast.success(response.data.message);
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error(error)
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(URL + "/api/posts/user/" + params); // Added a forward slash after "user"
            const postData = response.data.posts
            setUserPosts(postData)
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    useEffect(() => {
        fetchUserPosts();
    }, [params]);

    return (
        <div className="pt-16">
            <Helmet><title>Profile</title></Helmet>
            <Navbar />
            <div className='flex flex-col sm:flex-row-reverse sm:justify-between  m-3 z-0' >
                <form onSubmit={handleUserUpdate} className='sm:w-[30%] md:w-[25%] lg:w-[18%] my-5 sm:fixed  '>
                    <h1 className='text-xl text-gray-900 font-bold mb-3'>My Profile:</h1>
                    <div className='w-full flex flex-col   items-center my-2  *:my-2'>
                        <input type="text" placeholder="Your user name" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='outline-none border border-gray-900 py-1 px-2 w-full '
                        />
                        <input type="email" placeholder="Your email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='outline-none border border-gray-900 py-1 px-2 w-full  '
                        />
                    </div>
                    <div className=' flex items-center justify-between *:py-1 *:px-2  sm:flex-col'>
                        <button type="submit" className="bg-gray-900 text-white cursor-pointer w-[48%]  sm:w-full  my-1 rounded-md ">Update My Profile <i className="fa-solid fa-pen-to-square mx-1"></i></button>
                        <button type='button' onClick={handleUserDelete} className="bg-red-700 text-white cursor-pointer w-[48%]  sm:w-full  my-1  rounded-md">Delete My Profile<i className="fa-solid fa-trash mx-2"></i></button>
                    </div>
                </form>
                <div className='my-5  sm:mr-[33%] md:mr-[28%] lg:mr-[20%] xl:mr-[25%]   xl:w-[60%]'>
                    <h1 className='text-xl text-gray-800 my-3 font-bold'>My Posts:</h1>
                    {userPosts?.map((post) => (
                        <ProfilePosts key={post._id} post={post} />
                    ))}
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
}
