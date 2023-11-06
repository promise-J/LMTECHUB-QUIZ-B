import Response from "../models/reponseModal.js"
import Quiz from "../models/quizModal.js"
import User from "../models/userModel.js"
import { isValidObjectId } from "../utils/isValidObjectId.js"
import { COMPLETED, IN_PROGRESS } from "../utils/constants.js"
import completeQuiz from "../emailTemplates/completeQuizTemplate.js"
import sendMail from "../utils/mailService.js"

export const createResponse = async(req, res)=>{
   
    try {
        const {response, userId, email} = req.body
        const quizId = req.params.quizId
        const isValidQuizId = isValidObjectId(quizId)
        const isValidUserId = isValidObjectId(userId)
        if(!isValidQuizId) return res.json({success: false, message: 'Please provide a valid quiz Id'})
        if(!isValidUserId) return res.json({success: false, message: 'Please provide a valid user Id'})
        if(!Array.isArray(response) || response.length < 1) return res.json({success: false, message: 'Please provide a valid response'})
        const actualQuiz = await Quiz.findById(quizId)
        const actualUser = await User.findById(userId)
        if(!actualQuiz.candidates.includes(actualUser.email)){
            return res.json({success: false, message: 'You were not invited for this quiz'})
        }
        if(actualQuiz.completedCandidates.includes(actualUser.email)){
            return res.json({success: false, message: 'You have already sent a response'})
        }
        const userResponse = await Response.findOne({email, quizId})
        if(!userResponse) return res.json({success: false, message: 'Looks like you weren\t invited for this quiz after all!'})
        if(userResponse.responseStatus == COMPLETED){
            return res.json({success: false, message: 'You have already taken this quiz'})
        }
        actualQuiz.completedCandidates.push(actualUser.email)
        await actualQuiz.save()
        const mailOptions = {
            from: "LMtechub.com",
            to: email,
            subject: `Completion of ${actualQuiz.title} Quiz`,
            html: completeQuiz(actualQuiz.title),
          };
         sendMail(mailOptions)
        const quizAnswers = await actualQuiz.getQuizResponse()
        const theResult = userResponse.generateResult(quizAnswers, response)
        userResponse.score = theResult
        userResponse.response = response
        userResponse.timeLeft = 0
        userResponse.responseStatus = COMPLETED
        await userResponse.save()
        return res.status(200).json({success: true, message: 'Response sent!'})
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
        if(!isValidQuizId) return res.json({success: false, message: 'Please provide a valid quiz ID'})
        if(!isValidUserId) return res.json({success: false, message: 'Please provide a valid user ID'})
        const response = await Response.find({quizId})
        return res.json({success: true, message: response})
    } catch (error) {
        console.log(error)
    }
}

export const startResponse = async(req, res)=>{
    try {
        const quizId = req.params.quizId
        const {email} = req.body
        if(!isValidObjectId(quizId)){
            return res.json({success: false, message: 'Please provide valid quiz object ID'})
        }
        if(!email){
            return res.json({success: false, message: 'Please provide valid email'})
        }

        const userResponse = await Response.findOne({email, quizId})
        if(!userResponse){
            return res.json({success: false, message: 'Seems you werent invited'})
        }
        if(userResponse.responseStatus==IN_PROGRESS || userResponse.responseStatus==COMPLETED){
            return res.json({success: false, message: 'You are not allowed to continue'})
        }

        userResponse.responseStatus = IN_PROGRESS
        await userResponse.save()
        return res.status(200).json({success: true, message: `${email} quiz is in progress`})
    } catch (error) {
        console.log('error')
    }
}

export const endResponse = async(req, res)=> {
    try {
        const quizId = req.params.quizId
        const {email} = req.body
        if(!isValidObjectId(quizId)){
            return res.json({success: false, message: 'Please provide valid quiz object ID'})
        }
        if(!email){
            return res.json({success: false, message: 'Please provide valid email'})
        }

        const userResponse = await Response.findOne({email, quizId})
        if(!userResponse){
            return res.json({success: false, message: 'Seems you werent invited'})
        }

        userResponse.responseStatus = IN_PROGRESS
        await userResponse.save()
        return res.status(200).json({sucess: true, message: `${email} quiz is in progress`})
    } catch (error) {
        console.log(error)
    }
}

export const updateTime = async(req, res)=>{
    try {
        const quizId = req.params.quizId
        const {email, timeLeft, userResponse} = req.body
        if(!email){
            return res.json({success: false, message: 'Please provide an email'})
        }
        if(!isValidObjectId(quizId)){
            return res.json({success: false, message: 'Please provide a valid quiz ID'})
        }
        const response = await Response.findOne({email, quizId})
        response.timeLeft = timeLeft
        response.response = userResponse
        await response.save()
        return res.status(200).json({success: false, message: 'Time updated'})
    } catch (error) {
        console.log(error)
    }
}

export const getResponse = async(req, res)=>{
    try {
        const {responseId} = req.params
        if(!isValidObjectId(responseId)){
            return res.json({success: false, message: 'Please provide a valid object ID'})
        }
        const response = await Response.findById(responseId)
        if(!response){
            return res.json({success:false, message: 'Response not found'})
        }
        return res.json({success: true, message: response})
        
    } catch (error) {
        console.log(error)
    }
}