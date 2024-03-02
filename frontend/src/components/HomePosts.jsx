import { FILE } from "../url";
import { Helmet } from "react-helmet";


export default function HomePosts({ post }) {
    if (!post) {
        // You might want to handle the case where 'post' is undefined or null
        return null;
    }

    return (
        <div className="w-full flex justify-center items-center">
            <Helmet>
                <title>Home</title>
            </Helmet>
            <div className="m-3 md:w-[80%] flex flex-col shadow-2xl shadow-gray-900 hover:shadow-black ">
                <h1 className="text-xl text-gray-900 font-bold text-center mt-5">{post.title}</h1>
                <div className="md:flex items-start justify-between lg:justify-center">
                    {post.photo && <img src={FILE + post.photo} alt="" className="mt-2 md:p-3 md:w-[50%] lg:w-[40%] xl:w-[25%]" />}
                    <div className="*:my-3 *:pb-2 md:w-[60%]  px-3">
                        <div className="flex justify-between items-center border-b">
                            <h5 className="font-bold">@{post.username} </h5>
                            <h5 className="text-sm font-bold">{new Date(post.createdAt).toString().slice(0, 24)} </h5>
                        </div>

                        {/* Check if 'categories' property and 'demo' property exist before accessing */}
                        <div className="flex justify-between items-center border-b">
                            <p className="font-bold">Category:</p>
                            {post.categories && post.categories && <h5 className="text-sm font-bold">{post.categories} </h5>}
                        </div>

                        {/* Check if 'desc' property exists before accessing and slicing */}
                        {post.desc && <h5>{post.desc.slice(0, 200)} ....
                            <span className="border-b-2 border-gray-900 font-bold  px-3 ">Read more <i className="fa-solid fa-angles-right"></i></span> </h5>}
                    </div>
                </div>
            </div>
        </div>
    );
}
