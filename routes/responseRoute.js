
import express from 'express'
import { createResponse } from '../controllers/responseCtrl.js'
// import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/response/quiz/:quizId').post(createResponse)


export default router