import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {Helmet} from "react-helmet";
// ... Import statements
export default function EditPost() {
    const navigate = useNavigate();
    const postId = useParams().id;
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

    const fetchPost = async () => {
        try {
            const response = await axios.get(URL + "/api/posts/" + postId);
            const data = response.data.post;
            setTitle(data.title);
            setDesc(data.desc);
            setFile(data.photo);
            setCategories(data.categories);
        } catch (error) {
            console.error(error)
        }
    };
    useEffect(() => {
        fetchPost();
    }, [postId]);

    const handleFileDelete = () => {
        setFile(null);
        alert('Selected image deleted!');
        // Include logic for server-side file deletion if necessary
    };
    const addCategory = () => {
        let updatedCategories = [...categories];
        updatedCategories.push(category);
        setCategory("");
        setCategories(updatedCategories);
    };
    const deleteCategory = (index) => {
        let updatedCategories = [...categories];
        updatedCategories.splice(index, 1);
        setCategories(updatedCategories);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        const post = {
            title,
            desc,
            username: user.username,
            userId: user._id,
            categories: categories,
        };

        // File upload logic here...
        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("img", filename); // Fix here to append the file correctly
            data.append("file", file)
            post.photo = filename
            try {
                await axios.post(URL + "/api/upload", data);
            } catch (error) {
                console.error(error)
            }
        }
        try {
            const response = await axios.put(URL + "/api/posts/" + postId, post, { withCredentials: true });
            navigate("/posts/post/" + response.data.updatedBlog._id);
        } catch (error) {
            console.error(error)
        }
    };


    return (
        <div className="pt-28">
        <Helmet><title>Update Post</title></Helmet>
            <Navbar />
            <div className="min-h-[72dvh] flex flex-col justify-start items-center mb-5">
                <h1 className="text-xl font-bold text-gray-950 mb-5">Update my post</h1>
                <form onSubmit={handleUpdate} className="shadow-2xl shadow-gray-900 rounded-2xl bg-gray-800 flex flex-col p-5 text-white w-[350px]  sm:w-[600px] md:w-[750px] lg:w-[80%]">
                    <input type="text" placeholder="Enter blog Title:" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="outline-none border border-gray-900  p-1 px-2 m-1 text-black" />
                    <div className="flex justify-between items-center m-1">
                        <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="bg-white text-gray-900 w-80 " />
                        {file && <button type="button" onClick={handleFileDelete} className="cursor-pointer text-red-600 bg-white w-12 p-1 ml-1 rounded-md hover:bg-blue-100"><i className="fa-solid fa-xmark "></i>
                        </button>}
                    </div>
                    <div>
                        <div className="flex m-1 justify-between">
                            <input type="text" placeholder="Enter Post category:" value={category} onChange={(e) => setCategory(e.target.value)}
                                className="outline-none border border-gray-900 text-black  p-1 px-2 w-60 sm:w-80" />
                            <button type="button" onClick={addCategory} className="bg-white text-gray-900 rounded-md px-2 font-bold hover:bg-blue-100">Add</button>
                        </div>
                        {categories?.map((categoriesItem, index) => (
                            <div key={index} className="flex m-1 justify-between">
                                <p className="bg-white text-gray-900 p-1 w-60 sm:w-80">{categoriesItem}</p>
                                <button onClick={() => deleteCategory(index)} className="cursor-pointer text-red-600 bg-white w-12 p-1 rounded-md hover:bg-blue-100">
                                    <i className="fa-solid fa-x "></i></button>
                            </div>
                        ))}
                    </div>
                    <textarea name="" id="" cols="30" rows="10" placeholder="Enter blog Description:" value={desc} onChange={(e) => setDesc(e.target.value)}
                        className="outline-none border text-gray-900 m-1 max-h-96 p-2 text-b" ></textarea>
                    <button type="submit" className="text-gray-900 bg-white m-1 rounded-md font-bold uppercase hover:bg-blue-100 py-1"  >Update</button>
                    <button type="button" onClick={() => navigate(-1)}  className="text-gray-900 bg-white m-1 rounded-md font-bold uppercase hover:bg-blue-100 py-1"  >Cancel </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
