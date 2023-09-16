
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'candidate'],
        default: 'candidate'
    }
}, {timestamps: true})

userSchema.pre('save', async function(next){
    const user = this
    if(!user.isModified('password')) return
    try {
        const salt =  await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)
        user.password = hashPassword
    } catch (error) {
        return next(error)
    }
})

const User = mongoose.model('User', userSchema)

export default User