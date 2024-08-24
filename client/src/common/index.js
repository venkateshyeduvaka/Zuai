const url = "http://localhost:4002";

const backendDomain={
    auth: {
    signup: `${url}/api/auth/signup`,
    login: `${url}/api/auth/login`,
    logout: `${url}/api/auth/logout`,
    me: `${url}/api/auth/me`,
    profile:`${url}/api/auth/profile`,
    },
    posts:{
        createPost: `${url}/api/posts/create`,
        deletePost: `${url}/api/posts/delete`,
        updatePost:`${url}/api/posts/update`,
        allPosts: `${url}/api/posts/all`,
        specificPost:`${url}/api/posts/post`,
        
        likePost: `${url}/api/posts/like`,
        commentPost: `${url}/api/posts/comment`,
    },
    
    
}


export default backendDomain;