
import express from 'express'
import { createResponse, endResponse, startResponse, updateTime } from '../controllers/responseCtrl.js'
import auth from '../middleware/auth.js'
// import auth from '../middleware/auth.js'

const router = express.Router()

router.route('/response/quiz/:quizId').post(auth, createResponse)
router.route('/response/start/:quizId').put(auth, startResponse)
router.route('/response/start/:quizId').put(auth, endResponse)
router.route('/response/updateTime/:quizId').put(auth, updateTime)


export default router