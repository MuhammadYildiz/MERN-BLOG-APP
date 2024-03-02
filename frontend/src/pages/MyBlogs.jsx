
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import HomePosts from "../components/HomePosts";
import {  useContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {Helmet} from "react-helmet";
export default function MyBlogs() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(true);
    const {user} = useContext(UserContext)
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(URL + "/api/posts/user/" + user.id, { withCredentials: true });
            const data = response.data.posts;
            setBlogPosts(data);
            setResult(data.length === 0 ? false : true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user.id]); 

    return (
        <div className="pt-28">
        <Helmet><title>My Blog</title></Helmet>
            <Navbar />
            <div>
            {loading === true ? (
                <p className="text-center m-5">Loading...</p>
            ) : (
                result === true ? blogPosts.map((post) => (
                    <NavLink key={post._id} to={`/posts/post/${post._id}`}>
                        <HomePosts post={post} />
                    </NavLink>
                )) : (
                    <p className="text-center m-5 font-bold">No posts available</p>
                )
            )}
            </div>
            <Footer />
        </div>
    )
}
