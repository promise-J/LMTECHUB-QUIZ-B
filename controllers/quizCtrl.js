import mongoose from "mongoose";
import Quiz from "../models/quizModal.js";
import Response from "../models/reponseModal.js";
import Question from "../models/questionModal.js";
import sendMail from "../utils/mailService.js";
import inviteTemplate from "../emailTemplates/inviteTemplate.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import QuizService from "../services/quizService.js";

export const createQuiz = async (req, res) => {
  try{
  const { duration, title } = req.body;
  if (!duration || !title)ˇ
    return res.json({
      success: false,
      message: "Please provide a duration and title for the quiz",
    });
  const quizObject = {};
    const quizExists = await Quiz.findOne({ title });
    if (quizExists)
      return res.json({
        success: false,
        message: "Quiz title exists, change the title",
      });
    quizObject.title = title;
    quizObject.duration = duration;
    const quiz = await Quiz.create(quizObject);
    res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
  }
};

export const viewQuiz = async (req, res) => {
  try {
    if (quizId && isvalid) {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.json({ success: false, message: "Quiz not found" });
      return res.status(200).json(quiz);
    } else {
      return res.json({ success: false, message: "Provide valid quizId" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const viewQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const isvalid = mongoose.isValidObjectId(quizId);
    if (!quizId || !isvalid)
      return res.json({
        success: false,
        message: "Please provide a valid quiz Id",
      });
    const questions = await Question.find({ quizId }).populate("quizId");

    return res.status(200).json(questions);
  } catch (error) {
    console.log(error);
  }
};

export const viewQuizes = async (req, res) => {
  try {
    const quizService = new QuizService()
    const viewQuizes = await quizService.viewQuizes(req, res)
    if(viewQuizes.success !== true){
      return res.status(404).json(viewQuizes.error)
    }else{
      return res.status(200).json(viewQuizes.data)
    }
  } catch (error) {
    console.log(error);
  }
};

export const toggleCandidateToQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user._id;
    const { candidate } = req.body;
    const isValidUserId = mongoose.isValidObjectId(userId);
    if (!userId || !isValidUserId)
      return res.json({
        success: false,
        message: "Please provide a valid user to add",
      });
    if (!candidate) {
      return res.json({ success: false, message: "Please provide candidate" });
    }
    if (quizId) {
      const quiz = await Quiz.findById(quizId);
      const existUserResponse = await Response.findOne({quizId, email: candidate})
      const mailOptions = {
        from: "LMtechub.com",
        to: candidate,
        subject: "Invitation for a Quiz",
        html: inviteTemplate(quizId, quiz.title),
      };
      if (quiz) {
        if(existUserResponse){
          return res.json({success: false, message: 'Candidate has already been added'})
        }
        if (quiz.candidates.includes(candidate)) {
          const quizIdx = quiz.candidates.findIndex((c) => c == candidate);
          quiz.candidates.splice(quizIdx, 1);
          await quiz.save();
          return res.json({ success: true, message: "Candidate removed" });
        } else {
          sendMail(mailOptions);
          quiz.candidates.push(candidate);
          const userResponse = await Response.create({
            quizId: quiz._id,
            email: candidate,
          });
          userResponse.timeLeft = quiz.duration;
          await userResponse.save();
          await quiz.save();
          return res.json({
            success: true,
            message: "Candidate added successfully",
          });
        }
      } else {
        return res.json({ success: false, message: "Quiz not found" });
      }
  } else {
  return res.json({ success: false, message: "Provide Quiz Id" });
  } }catch (error) {
    console.log(error,'the error');
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user._id;
    const { candidate } = req.body;
    const isValidUserId = mongoose.isValidObjectId(userId);
    if (!userId || !isValidUserId)
      return res.json({
        success: false,
        message: "Please provide a valid user to add",
      });
    if (!candidate) {
      return res.json({ success: false, message: "Please provide candidate" });
    }
    if (quizId) {
      const quiz = await Quiz.findById(quizId);
      const existUserResponse = await Response.findOne({quizId, email: candidate})
      const mailOptions = {
        from: "LMtechub.com",
        to: candidate,
        subject: "Invitation for a Quiz",
        html: inviteTemplate(quizId, quiz.title),
      };
      if (quiz) {
        if(existUserResponse){
          return res.json({success: false, message: 'Candidate has already been added'})
        }
        if (quiz.candidates.includes(candidate)) {
          const quizIdx = quiz.candidates.findIndex((c) => c == candidate);
          quiz.candidates.splice(quizIdx, 1);
          await quiz.save();
          return res.json({ success: true, message: "Candidate removed" });
        } else {
          sendMail(mailOptions);
          quiz.candidates.push(candidate);
          const userResponse = await Response.create({
            quizId: quiz._id,
            email: candidate,
          });
          userResponse.timeLeft = quiz.duration;
          await userResponse.save();
          await quiz.save();
          return res.json({
            success: true,
            message: "Candidate added successfully",
          });
        }
      } else {
        return res.json({ success: false, message: "Quiz not found" });
      }
    } else {
      return res.json({ success: false, message: "Provide Quiz Id" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quizService = new QuizService()
    const deleteQuiz = await quizService.deleteQuiz(req, res)
    if(deleteQuiz.success !== true){
      return res.status(404).json(deleteQuiz.error)
    }else{
      return res.status(200).json(deleteQuiz.data)
    }
  } catch (error) {
    console.log(error);
  }
};

export const monitorQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const isValidQuizId = isValidObjectId(quizId);
    if (!isValidObjectId) return res.status(401).json("Quiz Id is not valid");
    const quizResponse = await Response.find({ quizId });
    return res.status(200).json(quizResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};
