import mongoose from "mongoose";
import { COMPLETED, IN_PROGRESS, NOT_STARTED } from "../utils/constants.js";
import QuestionModel from '../models/questionModal.js'

const responseSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    response: {
      type: [],
      default: [],
    },
    timeLeft: {
      type: Number,
    },
    email: {
      type: String,
      trim: true,
      required: true
    },
    responseStatus: {
      type: String,
      enum: [IN_PROGRESS, COMPLETED, NOT_STARTED],
      default: NOT_STARTED
    },
    score: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

responseSchema.methods.generateResult = async function(quizAnswers, userResponse, quizId){
  let score = 0

  const quizQuestions = await QuestionModel.find({quizId})
  
  quizAnswers.forEach((qz, idx)=>{
    if(qz== userResponse[idx]){
      const currQuest = quizQuestions[idx]
      score += currQuest.score
    }
  })
  return score
}


const Response = mongoose.model("Response", responseSchema);

export default Response;
