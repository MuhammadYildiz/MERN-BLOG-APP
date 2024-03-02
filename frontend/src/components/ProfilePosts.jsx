import { FILE } from "../url";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
export default function ProfilePosts({ post }) {
    return (
        <div className="border-b-2 mt-5  ">
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <h3 className="text-xl text-gray-900 text-center font-bold my-3">{post?.title} </h3>
            <div className="lg:flex">
                <img src={FILE + post?.photo} alt="" className="lg:w-[40%] lg:h-[40%] xl:w-[40%] lg:m-5" />
                <div className="lg:px-3">
                    <div className="flex justify-between items-center my-3 *:text-sm *:font-bold">
                        <p>@{post?.username}</p>
                        <h5>{new Date(post.createdAt).toString().slice(0, 24)} </h5>
                    </div>
                    <p >{post?.desc} </p>
                </div>
            </div>
            <div className="w-full text-center my-5">
                <NavLink to={`/posts/post/${post._id}`} className="bg-gray-900 text-white py-2 rounded-lg px-3">Update or delete my post</NavLink>
            </div>
        </div>
    )
}
