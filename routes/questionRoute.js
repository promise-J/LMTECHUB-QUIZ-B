
import express from 'express'
import { createQuestion, deleteQuestion, editQuestion } from '../controllers/questionCtrl.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/question').post(auth, createQuestion)
router.route('/question/:questionId').put(auth, editQuestion).delete(auth, deleteQuestion)

export default router
