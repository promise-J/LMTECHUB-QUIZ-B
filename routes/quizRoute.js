
import express from 'express'
import { createQuiz, deleteQuiz, monitorQuiz, toggleCandidateToQuiz, viewQuiz, viewQuizQuestions, viewQuizes } from '../controllers/quizCtrl.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/quiz').post(createQuiz)
router.route('/quiz/:quizId').get(viewQuiz).delete(deleteQuiz)
router.route('/quiz/questions/:quizId').get(viewQuizQuestions)
router.route('/quiz/response/:quizId').get(monitorQuiz)
router.route('/quiz/addCandidate/:quizId').put(auth, toggleCandidateToQuiz)
router.route('/quizes').get(viewQuizes)


export default router