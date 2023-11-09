
import express from 'express'
import { createQuiz, deleteQuiz, monitorQuiz, toggleCandidateToQuiz, updateQuiz, viewQuiz, viewQuizQuestions, viewQuizes } from '../controllers/quizCtrl.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/quiz').post(auth, createQuiz)
router.route('/quiz/:quizId').get(auth, viewQuiz).delete(auth, deleteQuiz).put(auth, updateQuiz)
router.route('/quiz/questions/:quizId').get(auth, viewQuizQuestions)
router.route('/quiz/response/:quizId').get(auth, monitorQuiz)
router.route('/quiz/addCandidate/:quizId').put(auth, toggleCandidateToQuiz)
router.route('/quizes').get(auth, viewQuizes)


export default router