import React, { useState,useContext ,useRef} from 'react';
import {useNavigate} from "react-router-dom"
import { FiMenu } from "react-icons/fi";
import { AiFillApple } from "react-icons/ai";
import { MdOutlineCreateNewFolder } from "react-icons/md";



import uploadImageToCloudinary from './uploadImageToCloudinary';
import { AppContext } from "../context/AppContext";
import backnedDomain from "../common";


const Header = ({getAllPosts}) => {

  const {customToast,setCurrentUser} = useContext(AppContext);

  const navigate = useNavigate();

  const textRef = useRef();
  const imageRef = useRef();
  const titleref=useRef()


  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [image, setImage] = useState(null);
  const [postdata, setPostdata] = useState({
    title:'',
    image: '',
    description: ''
  });



  const handleLogout = async () => {
    try {
      const res = await fetch(backnedDomain.auth.logout, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        customToast("success", data.message);
        setCurrentUser(null)
        navigate("/login");
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
   // console.log(file,"test1")
    const cloudinaryImage = await uploadImageToCloudinary(file);
  //  console.log(cloudinaryImage.url,"test2")
    setPostdata({ ...postdata, image: cloudinaryImage.url, description: textRef.current.value });
    setImage(cloudinaryImage.url); // Set image URL directly
  };


  const handleChange = (e) => {
    setPostdata({ ...postdata,title:titleref.current.value, description: textRef.current.value });
  }


  const handleCreatePost = async () => {
    // Handle post creation logic here
    //console.log('Image:',postdata.image);
    //console.log('Description:', postdata.description);
    //setModalOpen(false);
    //setImage(null); 
    //etPostdata({ image: '', description: '' }); 
    try {

      const res = await fetch(backnedDomain.posts.createPost, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title:postdata.title,text:postdata.description, image:postdata.image }),
      });
      const data = await res.json();
      if (data.success) {

        setModalOpen(false);
        setImage(null); 
        setPostdata({ title:'',image: '', description: '' }); 
        getAllPosts();
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className='flex w-full h-[80px] justify-between bg-header-gradient items-center p-4'>
        <div className='flex items-center'>
          <AiFillApple className='h-8 w-8 text-white' />
          <span className='text-white text-lg ml-2'>ZUAI</span>
        </div>
        <button className='flex md:hidden text-white' onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu className='h-6 w-6' />
        </button>
        <div className={`flex-col md:flex-row md:flex ${menuOpen ? 'flex' : 'hidden'} absolute md:static top-[80px] left-0 w-full md:w-auto bg-header-gradient`}>
          <ul className='flex flex-col md:flex-row w-full md:w-auto'>
            <li className='mr-2'>
              <button className='' onClick={() => setModalOpen(true)}>
                <MdOutlineCreateNewFolder className='h-8 w-16 text-white'/>
              </button>
            </li>
            <li className='mr-2'>
              <button onClick={handleLogout} className='text-blue-200 h-8 w-26 p-1 rounded text-center'>Logout</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Responsive Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>
            <div>
              <label htmlFor="title" className="block text-gray-700">Title</label>
              <input id="title" type="text" value={postdata.title} ref={titleref} onChange={handleChange} className="w-[60%] h-8 p-2 border border-gray-300 rounded mb-4"/>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={imageRef} 
              onChange={handleUploadImage}
              className="mb-4 w-full"
            />
            {image && (
              <div className="mb-4">
                <img src={image} alt="Preview" className="w-22 h-16 rounded" />
              </div>
            )}
            <textarea
              placeholder="Enter description..."
              value={postdata.description}
              ref={textRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
