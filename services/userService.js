import BaseService from "./base.js";
import User from "../models/userModel.js";
import { comparePassword, hashUserPassword } from "../utils/helpers.js";
import { generateToken } from "../libs/generateToken.js";

class UserService extends BaseService {
  constructor() {
    super();
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return UserService.sendFailedResponse(
          "Please enter the required fields"
        );
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return UserService.sendFailedResponse("User already exist");
      }
      const hashPass = hashUserPassword(password);
      const newUser = await User.create({
        email,
        password: hashPass,
        username,
      });
      return UserService.sendSuccessResponse({
        username: newUser.username,
        email: newUser.email,
      });
    } catch (error) {
      console.log(error);
      return UserService.sendFailedResponse(this.server_error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return UserService.sendFailedResponse("Please enter required fields");
      }
      const user = await User.findOne({ email });
      if (!user) {
        return UserService.sendFailedResponse(
          "Please register. You are not registered"
        );
      }
      const passIsMatch = await comparePassword(password, user);
      if (!passIsMatch) {
        return UserService.sendFailedResponse("Credentials are incorrect");
      }
      const token = generateToken({ id: user._id, role: user.role }, res);
      return UserService.sendSuccessResponse({ user, token });
    } catch (error) {
      console.log(error);
      return UserService.sendFailedResponse(this.server_error);
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return UserService.sendFailedResponse("User not found");
      return UserService.sendSuccessResponse(user);
    } catch (error) {
      return UserService.sendFailedResponse(this.server_error);
    }
  }

  async getAllUser(req, res) {
    try {
      const users = await User.find();
      return UserService.sendSuccessResponse(users)
    } catch (error) {
      return UserService.sendFailedResponse(this.server_error);
    }
  }
}

export default UserService;
