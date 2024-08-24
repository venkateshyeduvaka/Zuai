import React, {useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";


const RegisterForm = () => {

  const {customToast, setCurrentUser } =useContext(AppContext);

  const navigate=useNavigate()


  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    gender: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const signupUser = async () => {
    try {
      const res = await fetch(backendDomain.auth.signup, {
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
    console.log('Register Form Data:', formData);
    signupUser()
    // Add form submission logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-custom-gradient p-4">
      <form onSubmit={handleSubmit} className="bg-form-gradient p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="gender" className="block text-gray-700">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className='flex'>
            <span className="text-black text-sm underline hover:cursor-pointer mr-5">
              Already have an account? <span onClick={() => navigate("/login")} className='text-blue-900 font-bold text-md'>LogIn</span>
            </span>
            <button type="submit" className="w-32 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
             Register
            </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
