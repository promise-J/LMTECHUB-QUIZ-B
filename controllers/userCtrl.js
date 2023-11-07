import { generateToken } from "../libs/generateToken.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import UserService from "../services/userService.js";

export const register = async (req, res) => {
  try {

    const { username, email, password, role } = req.body;
    if (!username || !email)
      return res
        .json({ message: "Please enter the required fields" });
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({
        message: "User already exist, please login",
        redirect: "/login",
      });
    }
    const newUser = {
      email,
      username
    }
    if(password){
      const salt = await bcrypt.genSalt(10)
      const hashPass = await bcrypt.hash(password, salt)
      newUser.password = hashPass
    }
    if(role){
      newUser.role = role
    }
    const user = await User.create(newUser);
    return res
      .status(200)
      .json({
        success: true,
        email: user.email,
        username: user.username,
        redirect: "/login",
      });
  } catch (error) {
    return res.json({success: false, message: 'Something went wrong'})
    console.log(error);
  }
};

export const googleAuth = async(req, res)=>{
  try {
    const {email, displayName} = req.body
    const firstName = displayName.split(' ')[0]
    if(!email){
      res.json({success: false, message: 'Please provide email'})
    }
    const userExist = await User.findOne({email: email})
    if(userExist){
      const token = generateToken({ id: userExist._id, role: userExist.role }, res);
      return res.status(200).json({ success: true, user: userExist, token });
    }
    const user = await User.create({email, username: firstName})
    const token = generateToken({ id: user._id, role: user.role }, res);
    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.log(error)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status.json({ message: "Please enter required fields", success: false });
    const user = await User.findOne({email});
    if (!user) {
      return res
        .json({success: false, message: "User not registered", redirect: "/register" });
    }
    const passIsMatch = await bcrypt.compare(password, user.password)
    if(!passIsMatch){
      return res.json({success: false, message: 'Credentials incorrect'})
    }
    const token = generateToken({ id: user._id, role: user.role }, res);
    return res.status(200).json({ user, token, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    let token = req.headers;
    token = token.split(" ")[1];
    jwt.destroy(token);
    res.status(200).json({ message: "Logged out!" });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.json({success: false, message: "User not found" });
    return res.status(201).json(req.user);
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async(req, res)=>{
  try {
    if(!req.params.email) return res.status(404).json({message: 'Please provide email'})
    const user = await User.findOne({email: req.params.email})
    if(!user) return res.json({success: false, message: 'User not found'})
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }
}

export const profile = async (req, res) => {
  res.send("profile");
};

export const getAllUser = async (req, res) => {
  try {
    const userService = new UserService()
    const getAllUser = await userService.getAllUser(req, res)
    if(getAllUser.success !== true){
      return res.status(404).json({message: getAllUser.error})
    }else{
      return res.status(200).json({data: getAllUser.data})
    }
  } catch (error) {
    console.log(error);
  }
};
