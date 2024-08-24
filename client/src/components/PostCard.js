import React, { useState, useContext, useRef } from 'react';
import { IoIosMore } from "react-icons/io";
import { FaCommentAlt } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import CommentCard from './CommentCard';
import uploadImageToCloudinary from './uploadImageToCloudinary';
import { AppContext } from "../context/AppContext";
import backnedDomain from "../common";

const PostCard = ({ post, getAllPosts }) => {
  const { currentUser, customToast } = useContext(AppContext);
  const { image, text, title, _id, comments } = post;

  const [initialComment, setInitialComment] = useState(comments);
  const [comment, setComment] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [commentBoxOpen, setCommentBoxOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({ title, image, description: text });
  const [newImage, setNewImage] = useState(null);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const imageRef = useRef();

  const toggleOptions = () => setShowOptions(!showOptions);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const cloudinaryImage = await uploadImageToCloudinary(file);
    setNewImage(cloudinaryImage.url);
  };

  const handleUpdateChange = (e) => {
    setUpdateData({
      ...updateData,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
    });
  };

  const updatePost = async () => {
    try {
      const res = await fetch(`${backnedDomain.posts.updatePost}/${_id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updateData.title,
          text: updateData.description,
          image: newImage || updateData.image,
        }),
      });
      const data = await res.json();
      if (data.success) {
        customToast("success", data.message);
        getAllPosts();
        setIsUpdateModalOpen(false);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async () => {
    try {
      const res = await fetch(`${backnedDomain.posts.deletePost}/${_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        customToast("success", data.message);
        getAllPosts();
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setPostsComments = () => {
    setInitialComment((prev) => [
      ...prev,
      { text: comment, user: currentUser._id },
    ]);
  };

  const sendComment = async () => {
    try {
      const res = await fetch(`${backnedDomain.posts.commentPost}${_id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment.trim(), user: currentUser }),
      });
      const data = await res.json();
      if (data.success) {
        setPostsComments();
        setComment("");
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-white mb-4 rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Title and Symbol */}
      <div className="p-4 flex items-center relative">
        <h2 className="text-lg sm:text-xl font-semibold flex-grow truncate">{title}</h2>
        <button onClick={toggleOptions} className="text-lg sm:text-xl font-bold ml-2 focus:outline-none">
          <IoIosMore />
        </button>
        {showOptions && (
          <div className="absolute right-4 top-10 bg-white border rounded-lg shadow-lg p-2 space-y-2 z-10">
            <button
              onClick={() => {
                toggleOptions();
                setIsUpdateModalOpen(true);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                toggleOptions();
                deletePost();
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      {/* Description */}
      <div className="p-4 flex-1">
        <p className="text-gray-700 text-sm sm:text-base">{text}</p>
      </div>

      {/* Icons */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm sm:text-base">
          <AiFillLike className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <span className="text-gray-700">likes</span>
        </div>
        <div className="flex items-center space-x-2 text-sm sm:text-base">
          <FaCommentAlt onClick={() => setCommentBoxOpen(!commentBoxOpen)} className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          <span className="text-gray-700">comments</span>
        </div>
      </div>

      {commentBoxOpen && (
        <div className="bg-white flex flex-col p-4 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-800 cursor-pointer">Comments</h3>
            <RxCross2 onClick={() => setCommentBoxOpen(false)} className="h-5 w-5 text-gray-800 cursor-pointer" />
          </div>

          {/* Comment Input and List */}
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 p-2 h-8 bg-transparent outline-none border-2 border-gray-300 rounded-md"
                placeholder="Add a comment..."
              />
              <button
                className="ml-2 h-8 w-16 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                onClick={sendComment}
              >
                Post
              </button>
            </div>
            <div className=" overflow-y-auto">
              {initialComment.map(comment => (
                <CommentCard key={comment._id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Post</h2>
            <div>
              <label htmlFor="updateTitle" className="block text-gray-700">Title</label>
              <input
                id="updateTitle"
                type="text"
                value={updateData.title}
                ref={titleRef}
                onChange={handleUpdateChange}
                className="w-full h-8 p-2 border border-gray-300 rounded mb-4"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={imageRef}
              onChange={handleUploadImage}
              className="mb-4 w-full"
            />
            {newImage || updateData.image ? (
              <div className="mb-4">
                <img
                  src={newImage || updateData.image}
                  alt="Preview"
                  className="w-22 h-16 rounded"
                />
              </div>
            ) : null}
            <textarea
              placeholder="Enter description..."
              value={updateData.description}
              ref={descriptionRef}
              onChange={handleUpdateChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={updatePost}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
