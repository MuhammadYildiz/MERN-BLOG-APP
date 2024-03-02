import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { NavLink, useLocation } from "react-router-dom";
import {Helmet} from "react-helmet";
export default function Home() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(true);
    const { search } = useLocation();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(URL + "/api/posts" + search, { withCredentials: true });
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
    }, [search]); // Empty dependency array to fetch posts only once on component mount

    return (
        <div className="pt-24 ">
        <Helmet><title>Home</title></Helmet>
            <Navbar />
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
            <Footer />
        </div>
    );
}