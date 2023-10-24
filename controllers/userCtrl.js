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
    const userService = new UserService()
    const login = await userService.login(req, res)
    if(login.success !== true && login.error){
      return res.json({message: login.error, success: false})
    }else{
      return res.status(200).json({success: true, data: login.data})
    }
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
    const userService = new UserService()
    const getUser = await userService.getUser(req, res)
    if(getUser.success !== true){
      return res.status(404).json({message: getUser.error})
    }else{
      return res.status(200).json(getUser.data)
    }
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
