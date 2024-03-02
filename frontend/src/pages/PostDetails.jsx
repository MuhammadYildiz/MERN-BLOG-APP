import { useContext, useEffect, useState } from "react";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FILE, URL } from "../url";
import { UserContext } from "../context/UserContext";
import {Helmet} from "react-helmet";
export default function PostDetails() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext);
    const [postDetails, setPostDetails] = useState([]);
    const postId = useParams().id;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    /* Fetch post details */
    const fetchDetails = async () => {
        try {
            const response = await axios.get(URL + "/api/posts/" + postId);
            const posData = response.data.post;
            setPostDetails(posData);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [postId]);
    /* Delete post */
    const handleDeletePost = async () => {
        try {
            await axios.delete(URL + "/api/posts/" + postId, { withCredentials: true });
            navigate("/")
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                alert("Server Error: " + error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received

                alert("Request Error: " + error.message);
            } else {
                // Something happened in setting up the request that triggered an Error

                alert("General Error: " + error.message);
            }
        }
    };
    const moveToEdit = () => {
        navigate("/edit/" + postId)
    }
    /*Fetch comments */
    const fetchComments = async () => {
        try {
            const response = await axios.get(URL + "/api/comments/post/" + postId);
            const data = response.data.comments; // Adjust to use the correct data property
            setComments(data);
        } catch (error) {
            console.error(error)
        }
    };
    useEffect(() => {
        fetchComments();
    }, [postId, setComments]);

    /* Create and post comment */
    const postComment = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login and write your comment")
        }
        try {
            const response = await axios.post(URL + "/api/comments/create", {
                comment: comment,
                author: user.username,
                postId: postId,
                userId: user.id
            }, { withCredentials: true });

            const data = response.data.comment;
            setComments((prevComments) => [...prevComments, data]); // Update comments state
            setComment(""); // Clear the comment input
        } catch (error) {
            console.error(error);
        }
    };
    const moveToHome = () => {
        navigate("/")
    }
    return (
        <div className="pt-10   w-full">
        <Helmet><title>Post Details</title></Helmet>
            <Navbar />
            <div className="w-full flex justify-center items-center">
                <div className="p-3 md:w-[80%]">
                    <div className="flex justify-between items-center w-full my-10   ">
                        <button className=" text-gray-900 px-2 hover:border-b-2 h-5 border-gray-900 font-bold flex items-center justify-end "
                            onClick={moveToHome}
                        ><i className="fa-solid fa-backward p-1 "></i>To Home</button>
                    </div>
                    <h3 className="text-2xl text-gray-900 font-bold text-center my-10 ">{postDetails.title} </h3>
                    <div className=" flex justify-between items-start">
                        <div>
                            <p>@Author: <span className="font-bold">{postDetails.username}</span></p>
                            <h5 className="text-sm font-bold my-5">{new Date(postDetails.createdAt).toString().slice(0, 24)} </h5>
                            {postDetails.categories?.map((category, index) => (
                                <div key={index} className="text-sm font-bold">Category: {category}</div>
                            ))}
                        </div>
                        {user?.id === postDetails?.userId && user && (
                            <div className="*:m-1  flex items-center">
                                <button type="button" onClick={moveToEdit}
                                    className="bg-gray-900 text-white cursor-pointer p-1 px-2 rounded-md text-sm "><i className="fa-solid fa-pen-to-square"></i></button>
                                <button className="bg-gray-900 text-red  text-red-600 cursor-pointer p-1 px-2 rounded-md text-sm hover:text-white"
                                    onClick={handleDeletePost}
                                ><i className="fa-solid fa-trash"></i></button>
                            </div>
                        )}
                    </div>
                    <img src={FILE + postDetails.photo} alt="" className="h.[300px] md:h-[700px] w-full my-5" />
                    <p className="line-height-10 border-b-2 pb-5"> post descriptions: {postDetails.desc} </p>
                    <h3 className="text-md font-bold mt-5 border-2 px-3 rounded-full border-b-0 shadow-sm shadow-gray-900  w-[120px]">Comments:</h3>
                    {comments.map((comment) => (
                        <Comment key={comment?._id} comment={comment} post={postDetails} />
                    ))}
                    <h3 className="text-md font-bold mt-10 border-2 px-3 rounded-full border-b-0 shadow-sm shadow-gray-900  w-[180px]">Write Comments:</h3>
                    <form onSubmit={postComment} className="flex flex-col w-full   ">
                        <input
                            type="text"
                            placeholder="Write a comment "
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="outline-none border border-gray-900 p-2 w-full mt-5  "
                        />
                        <button type="submit"
                            className="bg-gray-900 text-white p-2 font-bold rounded-md text-center my-2">
                            Post Comment
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
