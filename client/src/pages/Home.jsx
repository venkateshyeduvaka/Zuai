import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import SideBar from '../components/SideBar';

// SkeletonLoader Component
const SkeletonLoader = () => (
  <div className="flex justify-center items-center h-full py-10">
    <div className="w-6 h-6 ml-2 bg-white rounded-full animate-bounce"></div>
    <div className="w-6 h-6 ml-2 bg-white rounded-full animate-bounce delay-200"></div>
    <div className="w-6 h-6 ml-2 bg-white rounded-full animate-bounce delay-400"></div>
  </div>
);

const Home = () => {
  const { currentUser, customToast } = useContext(AppContext);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state

  const getAllPosts = async () => {
    try {
      const res = await fetch(backendDomain.posts.allPosts, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAllPosts(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);  // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAllPosts();
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col h-[100vh] bg-home-gradient">
      <Header getAllPosts={getAllPosts} className="fixed top-0 left-0 w-full z-10 shadow-md" />
      <div className='h-[100%] w-[100%]'>
        {/*<SideBar />*/}
        <div className='h-[100%] w-[100%] flex flex-wrap  bg-custom-gradient overflow-y-scroll custom-scrollbar overflow-x-clip overflow-y-clip scrollbar-none'>
          {loading ? (
            // Display skeleton loaders while loading
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : allPosts.length === 0 ? (
            // Display a default post if no posts are available
            <PostCard post={{ title: "No posts available", content: "Please check back later." }} />
          ) : (
            // Display all posts
            allPosts.map(post => (
              <PostCard key={post._id} post={post} getAllPosts={getAllPosts} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
