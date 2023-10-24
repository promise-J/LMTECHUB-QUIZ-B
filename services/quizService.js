import mongoose from "mongoose";
import inviteTemplate from "../emailTemplates/inviteTemplate.js";
import Question from "../models/questionModal.js";
import Quiz from "../models/quizModal.js";
import BaseService from "./base.js";
import Response from "../models/reponseModal.js";
import sendMail from "../utils/mailService.js";
import { empty } from "../utils/helpers.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import { NOT_STARTED } from "../utils/constants.js";

class QuizService extends BaseService {
  constructor() {
    super();
  }

  async createQuiz(req, res) {
    try {
      const { duration, title } = req.body;
      if (!duration || !title) {
        return QuizService.sendFailedResponse(
          "Please provide a duration and title for the quiz"
        );
      }
      const quizObject = {};
      const quizExists = await Quiz.findOne({ title });
      if (quizExists) {
        return QuizService.sendFailedResponse(
          "Quiz title exists, change the title"
        );
      }
      quizObject.title = title;
      quizObject.duration = duration;
      const quiz = await Quiz.create(quizObject);
      return QuizService.sendSuccessResponse(quiz);
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }

  async viewQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const isvalid = mongoose.isValidObjectId(quizId);
      if (quizId && isvalid) {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
          return QuizService.sendFailedResponse("Quiz not found");
        }
        return QuizService.sendSuccessResponse(quiz);
      } else {
        return QuizService.sendFailedResponse("Please provide valid quizId");
      }
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }

  async viewQuizQuestions(req, res) {
    try {
      const { quizId } = req.params;
      const isvalid = mongoose.isValidObjectId(quizId);
      if (!quizId || !isvalid) {
        return QuizService.sendFailedResponse("Please provide a valid quiz ID");
      }
      const questions = await Question.find({ quizId }).populate("quizId");
      return QuizService.sendSuccessResponse(questions);
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }

  async viewQuizes(req, res) {
    try {
      const quizes = await Quiz.find();
      return QuizService.sendSuccessResponse(quizes);
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }

  async toggleCandidateToQuiz(req, res) {
    try {
      const quizId = req.params.quizId;
      const userId = req.user._id;
      const { candidate } = req.body;
      const isValidUserId = mongoose.isValidObjectId(userId);
      if (!userId || !isValidUserId) {
        return QuizService.sendFailedResponse(
          "Please provide a valid user to add"
        );
      }
      if (!candidate) {
        return QuizService.sendFailedResponse("Pleas provide candidate");
      }
      if (quizId) {
        const quiz = await Quiz.findById(quizId);
        const mailOptions = {
          from: "LMtechub.com",
          to: "chiemelapromise30@gmail.com",
          subject: `Invitation for ${quiz.title} Quiz`,
          html: inviteTemplate(quizId, quiz.title),
        };
        const responseExists = await Response.findOne({
          email: candidate,
          quizId: quiz._id,
        });
        if (quiz) {
          if (quiz.candidates.includes(candidate)) {
            if (responseExists) {
              const quizIdx = quiz.candidates.findIndex((c) => c == candidate);
              quiz.candidates.splice(quizIdx, 1);
              await quiz.save();
              await Response.findByIdAndDelete(responseExists._id);
            }
            return QuizService.sendFailedResponse(
              "Candidate has now been removed"
            );
          } else {
            if (responseExists) {
              return QuizService.sendFailedResponse(
                "You have already added this candidate"
              );
            }
            const userResponse = await Response.create({
              quizId: quiz._id,
              email: candidate,
            });
            userResponse.timeLeft = quiz.duration;
            await userResponse.save();
            quiz.candidates.push(candidate);
            await quiz.save();
            sendMail(mailOptions);
            return QuizService.sendSuccessResponse({
              message: "Candidate added successfull",
            });
          }
        } else {
          return QuizService.sendFailedResponse("Quiz not found");
        }
      } else {
        return QuizService.sendFailedResponse("Provide Quiz ID");
      }
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }

  async updateQuiz(req, res){
    try {
      const {title, duration} = req.body
      const {quizId} = req.params
      if(!isValidObjectId(quizId)){
        return QuizService.sendFailedResponse('Please enter a valid quiz ID')
      }
      const responses = await Response.find({quizId})
      const quizNotStarted = responses.every(res=> res.responseStatus === NOT_STARTED)
      if(!quizNotStarted){
        return QuizService.sendFailedResponse('Cant edit quiz as it has already started')
      }
      let update_data = {}
      if(!empty(title)){
        update_data['title'] = title
      }
      if(!empty(duration)){
        update_data['duration'] = duration
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, update_data, {new: true})
      return QuizService.sendSuccessResponse('Quiz updated successful')
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error)
    }
  }

  async deleteQuiz(req, res) {
    try {
      const quizId = req.params.quizId;
      const isValidQuizId = mongoose.isValidObjectId(quizId);
      if (!quizId || !isValidQuizId) {
        return QuizService.sendFailedResponse("Please enter a valid quiz ID");
      }
      const questions = await Question.find({ quizId });
      for (const q of questions) {
        await q.deleteOne();
      }
      await Quiz.findByIdAndDelete(quizId);
      return QuizService.sendSuccessResponse({ message: "Quiz deleted" });
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }

  async monitorQuiz(req, res) {
    try {
      const quizId = req.params.quizId;
      const isValidQuizId = isValidObjectId(quizId);
      if (!isValidObjectId) return QuizService.sendFailedResponse('Quiz ID is not valid')
      const quizResponse = await Response.find({ quizId });
      return QuizService.sendSuccessResponse(quizResponse)
    } catch (error) {
      return QuizService.sendFailedResponse(this.server_error);
    }
  }
}

export default QuizService;
