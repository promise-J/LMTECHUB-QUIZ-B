import express from 'express'
const router = express.Router()
import userRoute from './userRoute.js'
import quizRoute from './quizRoute.js'
import questionRoute from './questionRoute.js'
import responseRoute from './responseRoute.js'


router.use(userRoute)
router.use(quizRoute)
router.use(questionRoute)
router.use(responseRoute)

export default router




