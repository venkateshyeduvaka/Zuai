import React, { useContext,useState } from 'react';
import {useNavigate } from "react-router-dom";
import {AppContext} from "../context/AppContext"
import backendDomain from "../common"

const LoginForm = () => {
  const {customToast, setCurrentUser } =
    useContext(AppContext);

    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    try {
      const res = await fetch(backendDomain.auth.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success) {
        customToast("success", resData.message);
        setCurrentUser(resData.data);
        navigate("/");
      } else {
        customToast("error", resData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Form Data:', formData);
    loginUser()
    // Add form submission logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-custom-gradient p-4">
      <form onSubmit={handleSubmit} className="bg-form-gradient p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className='flex'>
          <span className="text-black text-sm underline hover:cursor-pointer mr-5">Don't have an account <span onClick={() => navigate("/register")} className="text-blue-900 font-bold text-md">Sign up</span></span>
          <button type="submit" className="w-32 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
