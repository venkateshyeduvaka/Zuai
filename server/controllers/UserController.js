const UserModel=require("../models/UserModel")

const bcrypt = require("bcrypt");

const gerateTokenAndSetCookie=require("../utils/gerateTokenAndSetCookie")


const signup = async (req, res) => {
  try {
    const { username, fullName, password,gender} = req.body;


    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      throw Error("Username is already taken");
    }

    if (password.length < 6) {
      throw Error("Password must have at least 6 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username,
      fullName,
      gender,
      password: hashedPassword,
    });

    if (newUser) {
      gerateTokenAndSetCookie(newUser._id, res);

      await newUser.save();
      const user = {
        _id: newUser._id,
        username,
        fullName,
        gender,
      };

      res.status(201).json({
        message: "Signup successfull",
        data: user,
        success: true,
        error: false,
      });
    } else {
      throw Error("User data invalid");
    }
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};



const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw Error("Please provide username");
    } else if (!password) {
      throw Error("Password field is required");
    }

    const user = await UserModel.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      throw Error("Invalid username or password");
    }

    gerateTokenAndSetCookie(user._id, res);
    const loginUser = {
      _id: user._id,
      username,
      fullName: user.fullName,
      gender:user.gender,
    };

    res.status(200).json({
      message: "Login successfull",
      data: loginUser,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfull",
      data: {},
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const getMe = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id).select("-password")
    const user = req.user;
    res.status(200).json({
      message: "User details fetched successfull",
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};


const userProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extracting id from request parameters

    // Fetching user details by ID
    const user = await UserModel.findById(id).select("-password");
    

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // Successful response
    res.json({
      message: "User profile fetched successfully",
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);

    // Error response
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { signup, login, logout, getMe,userProfile };
