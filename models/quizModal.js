import mongoose from "mongoose";
import Question from './questionModal.js'

const quizSchema = new mongoose.Schema({
  title: {type: String, required: true, unique: true},
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  duration: {type: Number, required: true},
  candidates: {type: [String], default: []},
  completedCandidates: {type: [String], default: []}
}, {timestamps: true});


quizSchema.methods.getQuizResponse = async function(){
  const answers = []
  const allQuiz = await Question.find({quizId: this._id})
  allQuiz.forEach(q=>{
    answers.push(q.correctOption)
  })
  return answers
}


const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz
