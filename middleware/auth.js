import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

async function auth(req, res, next) {
  let token = req.headers['authorization'];
  // console.log(req.headers, 'the token')
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token. You are not authorized" });
    }
    token = token.split(' ')[1]
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select('-password -updatedAt -createdAt -__v')
    req.user = user
    next();
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

export const authLogout = (req, res, next)=>{
  let token = req.headers['authorization']
  console.log('logging out', token)
  try {
    if(!token){
      return res.status(401).json('Please provide a token')
    }
    console.log(token)
    next()
  } catch (error) {
    console.log(error)
  }
}


export default auth;
