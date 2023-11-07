
import express from 'express'
import { getAllUser, getUser, getUserByEmail, googleAuth, login, logout, profile, register } from '../controllers/userCtrl.js'
import auth, { authLogout } from '../middleware/auth.js'

const router = express.Router()

//userRoutes
router.route('/register').post(register)
router.route('/google-auth').post(googleAuth)
router.route('/login').post(login)
router.route('/profile').get(auth, profile)
router.route('/user').get(auth, getUser)
router.route('/user/:email').get(auth, getUserByEmail)
router.route('/logout').post(authLogout, logout)
router.route('/users').get(auth, getAllUser)

export default router