import mongoose from "mongoose";
import Question from "../models/questionModal.js";

export const createQuestion = async (req, res) => {
  try {
    const newQuestion = {}
    const { quizId, options, correctOption, title, questionType, score, theory, subobjective } = req.body;
    const isValidQuizId = mongoose.isValidObjectId(quizId);
    if (!isValidQuizId)
      return res.json({ success: false, message: "Please enter a valid quiz Id" });
      if (!title || !questionType || !score) {
      return res
        .json({success: false, message: "Please enter options, correct option, question type and title" });
    }
    
    newQuestion.quizId = quizId
    newQuestion.title = title
    newQuestion.userId = req.user._id
    newQuestion.score = score

    if(questionType=='objective'){
      newQuestion.options = options
      newQuestion.correctOption = +correctOption
      newQuestion.questionType = questionType
    }

    if(questionType=='theory'){
      newQuestion.questionType = questionType
      newQuestion.theory = theory
    }

    if(questionType=='subobjective'){
      newQuestion.questionType = questionType
      newQuestion.subobjective = subobjective
    }

    const question = await Question.create(newQuestion);
    res.json({success: true, message: question});
  } catch (error) {
    console.log(error);
  }
};

export const editQuestion = async (req, res) => {
  try {
    const { options, correctOption, title, score, questionType } = req.body;
    const questionId = req.params.questionId;
    const isValidQuestionId = mongoose.isValidObjectId(questionId);
    if (!questionId || !isValidQuestionId)
    return res
    .json({ success: false, message: "Please provide a valid question Id" });
    // const questionExists = await Question.find({title})
    // if(questionExists) return res.status(401).json({message: 'Question title already exist in your quiz catalog'})
    const question = await Question.findOne({_id: questionId, userId: req.user._id});
    if (options.length > 0) {
      question.options = options;
    }
    if (correctOption) {
      question.correctOption = correctOption;
    }
    if (title) {
      question.title = title;
    }
    if (score) {
      question.score = score;
    }
    if (questionType) {
      question.questionType = questionType;
    }
    await question.save();
    return res.json({success: true, message: question});
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const isValidQuestionId = mongoose.isValidObjectId(questionId);
    if (!questionId || !isValidQuestionId){
      return res.json({success: false, message: "Please provide a valid question Id" });
    }
    
    await Question.findOneAndDelete({_id: questionId, userId: req.user._id});
    return res.json({success: true, message: "Question Deleted!" });
  } catch (error) {
    console.log(error);
  }
};
