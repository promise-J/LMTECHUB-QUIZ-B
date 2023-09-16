
import express from 'express'
import { createQuestion, deleteQuestion, editQuestion } from '../controllers/questionCtrl.js'

const router = express.Router()

router.route('/question').post(createQuestion)
router.route('/question/:questionId').put(editQuestion).delete(deleteQuestion)

export default router
