import mongoose from "mongoose";
import { COMPLETED, IN_PROGRESS, NOT_STARTED } from "../utils/constants.js";

const reponseSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    response: {
      type: [Number],
      default: []
    },
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    email: {
      type: String,
      trim: true,
      unique: true,
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
    }
  },
  { timestamps: true }
);

reponseSchema.methods.generateResult = function(quizAnswers, userResponse){
  let score = 0
  quizAnswers.forEach((qz, idx)=>{
    if(qz== userResponse[idx]){
      score++
    }
  })
  return score
}

const Response = mongoose.model("Response", reponseSchema);

export default Response;
