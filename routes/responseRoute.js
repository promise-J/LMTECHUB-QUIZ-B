
import express from 'express'
import { createResponse, endResponse, startResponse, updateTime } from '../controllers/responseCtrl.js'
// import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/response/quiz/:quizId').post(createResponse)
router.route('/response/start/:quizId').put(startResponse)
router.route('/response/start/:quizId').put(endResponse)
router.route('/response/updateTime/:quizId').put(updateTime)


export default router