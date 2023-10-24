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
    const quizService = new QuizService()
    const createQuiz = await quizService.createQuiz(req, res)
    if(createQuiz.success !== true){
      return res.status(404).json(createQuiz.error)
    }else{
      return res.status(200).json(createQuiz.data)
    }
  } catch (error) {
    console.log(error);
  }
};

export const viewQuiz = async (req, res) => {
  try {
    const quizService = new QuizService()
    const viewQuiz = await quizService.viewQuiz(req, res)
    if(viewQuiz.success !== true){
      return res.status(404).json(viewQuiz.error)
    }else{
      return res.status(200).json(viewQuiz.data)
    }
  } catch (error) {
    console.log(error);
  }
};

export const viewQuizQuestions = async (req, res) => {
  try {
    const quizService = new QuizService()
    const viewQuizQuestions = await quizService.viewQuizQuestions(req, res)
    if(viewQuizQuestions.success !== true){
      return res.status(404).json(viewQuizQuestions.error)
    }else{
      return res.status(200).json(viewQuizQuestions.data)
    }
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
    const quizService = new QuizService()
    const toggleCandidateToQuiz = await quizService.toggleCandidateToQuiz(req, res)
    if(toggleCandidateToQuiz.success !== true){
      return res.status(404).json(toggleCandidateToQuiz.error)
    }else{
      return res.status(200).json(toggleCandidateToQuiz.data)
    }
  } catch (error) {
    console.log(error,'the error');
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quizService = new QuizService()
    const updatedQuiz = await quizService.updateQuiz(req, res)
    if(updatedQuiz.success !== true){
      return res.json({success: false, error: updatedQuiz.error})
    }else{
      return res.status(200).json({success: true, error: updatedQuiz.data})
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

export const monitorQuiz = async (req, res)=>{
  try {
    const quizService = new QuizService()
    const monitorQuiz = await quizService.monitorQuiz(req, res)
    if(monitorQuiz.success !== true){
      return res.status(404).json(monitorQuiz.error)
    }else{
      return res.status(200).json(monitorQuiz.data)
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json('Server error')
  }
}