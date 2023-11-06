import { generateToken } from "../libs/generateToken.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import UserService from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const userService = new UserService()
    const register = await userService.register(req, res)
    if(register.success !== true){
      return res.status(404).json({message: register.error})
    }else{
      return res.status(200).json(register.data)
    }
  } catch (error) {
    console.log(error);
  }
};

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
    console.log('logging out')
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
