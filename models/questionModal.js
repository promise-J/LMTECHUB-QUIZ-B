import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  questionType: {type: String, required: true, enum: ['theory', 'objective', 'sub_objective']},
  title: {type: String, required: true},
  options: { type: [String], required: true, default: []},
  score: {type: Number, required: true, default: 0},
  correctOption: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

const Question = mongoose.model("Question", questionSchema);

export default Question;
