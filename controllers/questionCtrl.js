import mongoose from "mongoose";
import Question from "../models/questionModal.js";

export const createQuestion = async (req, res) => {
  try {
    const { quizId, options, correctOption, title } = req.body;
    // const questionExists = await Question.findOne({ title });
    // if (questionExists)
      // return res.status(401).json({ message: "Question title already exists" });
    const isValidQuizId = mongoose.isValidObjectId(quizId);
    if (!isValidQuizId)
      return res.status(401).json({ message: "Please enter a valid quiz Id" });
      if (!options || isNaN(correctOption) || !title) {
      return res
        .status(404)
        .json({ message: "Please enter options, correct option and title" });
    }
    const question = await Question.create({
      quizId,
      options,
      correctOption: +correctOption,
      title,
      userId: req.user._id
    });
    res.status(200).json(question);
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
    .status(401)
    .json({ message: "Please provide a valid question Id" });
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
    return res.status(200).json({question});
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const isValidQuestionId = mongoose.isValidObjectId(questionId);
    if (!questionId || !isValidQuestionId)
      return res
        .status(401)
        .json({ message: "Please provide a valid question Id" });
    
    
    await Question.findOneAndDelete({_id: questionId, userId: req.user._id});
    return res.status(200).json({ message: "Question Deleted!" });
  } catch (error) {
    console.log(error);
  }
};
