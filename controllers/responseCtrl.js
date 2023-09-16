import Response from "../models/reponseModal.js"
import Quiz from "../models/quizModal.js"
import User from "../models/userModel.js"
import { isValidObjectId } from "../utils/isValidObjectId.js"
import { COMPLETED } from "../utils/constants.js"

export const createResponse = async(req, res)=>{
    try {
        const {response, userId, email} = req.body
        const quizId = req.params.quizId
        const isValidQuizId = isValidObjectId(quizId)
        const isValidUserId = isValidObjectId(userId)
        if(!isValidQuizId) return res.status(401).json({message: 'Please provide a valid quiz Id'})
        if(!isValidUserId) return res.status(401).json({message: 'Please provide a valid user Id'})
        if(!Array.isArray(response) || response.length < 1) return res.status(401).json({message: 'Please provide a valid response'})
        // const responseExists = await Response.find({userId, quizId})
        // console.log(responseExists)
        // if(responseExists.length > 0) return res.status(401).json({message: 'You have already sent a response'})
        const actualQuiz = await Quiz.findById(quizId)
        const actualUser = await User.findById(userId)
        if(!actualQuiz.candidates.includes(actualUser.email)){
            return res.status(401).json('You were not invited for this quiz')
        }
        if(actualQuiz.completedCandidates.includes(actualUser.email)){
            return res.status(401).json('You have already sent a response')
        }
        // const createdResponse = await Response.create({response, email, quizId})
        const userResponse = await Response.findOne({email})
        if(!userResponse) return res.status(401).json('Looks like you weren\t invited for this quiz after all!')
        if(userResponse.responseStatus == COMPLETED){
            return res.status(401).json('You have already taken this quiz')
        }
        actualQuiz.completedCandidates.push(actualUser.email)
        await actualQuiz.save()
        const quizAnswers = await actualQuiz.getQuizResponse()
        const theResult = userResponse.generateResult(quizAnswers, response)
        userResponse.score = theResult
        userResponse.responseStatus = COMPLETED
        await userResponse.save()
        return res.status(200).json({message: 'Response sent!'})
    } catch (error) {
        console.log(error)
    }
}

export const viewResponseByQuiz = async(req, res)=>{
    try {
        const quizId = req.params.quizId
        const {userId} = req.body
        const isValidQuizId = isValidObjectId(quizId)
        const isValidUserId = isValidObjectId(userId)
        // const isValidQuizId = isValidObjectId(quizId)
        if(!isValidQuizId) return res.status(401).json({message: 'Please provide a valid quiz ID'})
        if(!isValidUserId) return res.status(401).json({message: 'Please provide a valid user ID'})
        const response = await Response.find({quizId})
    } catch (error) {
        console.log(error)
    }
}