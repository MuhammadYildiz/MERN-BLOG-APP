import axios from "axios";
import { URL } from "../url";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import {Helmet} from "react-helmet";
export default function Comment({ comment, post }) {
    const { user } = useContext(UserContext);

    const handleDeleteComment = async (id) => {
        try {
            await axios.delete(`${URL}/api/comments/${id}`, { withCredentials: true });
            window.location.reload(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="my-5 border border-t-0 rounded-2xl p-2 shadow-sm shadow-gray-900">
        <Helmet>
            <title>Comment</title>
        </Helmet>
            <div className="flex justify-between items-center py-3">
                <h6 className="font-bold text-gray-800">@{comment.author} </h6>
                {user && user.id === comment.userId && (
                    <button className="text-red-700 bg-gray-950 cursor-pointer  text-sm p-1 rounded-full hover:text-white px-2" onClick={() => handleDeleteComment(comment._id)}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                )}
            </div>
            <h6 className="border p-3 bg-gray-100">Comments: {comment.comment} </h6>
            <h5 className="text-sm font-bold my-3">{new Date(comment.createdAt).toString().slice(0, 24)} </h5>

        </div>
    );
}
