import { generateToken } from "../libs/generateToken.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res
        .status(401)
        .json({ message: "Please enter the required fields" });
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(401).json({
        message: "User already exist, please login",
        redirect: "/login",
      });
    }
    const newUser = await User.create({ email, password, username });
    return res
      .status(200)
      .json({
        email: newUser.email,
        username: newUser.username,
        redirect: "/login",
      });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(401).json({ message: "Please enter required fields" });
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not registered", redirect: "/register" });
    }
    const passIsMatch = user.comparePassword(password)
    if(!passIsMatch){
      return res.status(401).json({message: 'Credentials incorrect'})
    }
    const token = generateToken({ id: user._id, role: user.role }, res);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
    console.log('called logout')
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
    if (!user) return res.status(401).json({ message: "User not found" });
    return res.status(201).json(req.user);
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async(req, res)=>{
  try {
    if(!req.params.email) return res.status(404).json({message: 'Please provide email'})
    const user = await User.findOne({email: req.params.email})
    if(!user) return res.status(401).json({message: 'User not found'})
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
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};
