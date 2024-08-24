import React, { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";

import backnedDomain from "../common";

const CommentCard = ({comment}) => {

  const [username,setusername]=useState("")

  //console.log(comment.user)

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // Assuming the backend endpoint requires the user ID to fetch the profile
        const res = await fetch(`${backnedDomain.auth.profile}/${comment.user}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        });
  
        const data = await res.json();
        //console.log("testing--->", data.data);
  
        if (res.ok) {
          setusername(data.data.username);
        } else {
          //customToast("error", data.message || "Failed to fetch username");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        //customToast("error", "An error occurred while fetching the username");
      }
    };
  
    if (comment?.user) {
      fetchUsername();
    }
  }, [comment.user]);

  return (
    <div className='flex gap-2 items-center'>
    <FaUserCircle className='h-8 w-8 text-blue rounded-full'/>
    <div className='flex flex-col p-2'>
     <span className='text-gray-400'>@{username}</span>
     <span className='text-blue-900'>{comment?.text}</span>
    </div>
 </div>
  )
}

export default CommentCard
