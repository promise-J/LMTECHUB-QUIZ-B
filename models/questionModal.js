import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  questionType: {type: String, required: true, trim: true, enum: ['theory', 'objective', 'subobjective']},
  title: {type: String, required: true, trim: true},
  options: { type: [String], default: []},
  theory: { type: String, trim: true},
  subobjective: { type: String, trim: true},
  score: {type: Number, required: true, trim: true},
  correctOption: {
    type: Number,
    trim: true
  },
}, {timestamps: true});

const Question = mongoose.model("Question", questionSchema);

export default Question;
