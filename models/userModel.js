
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
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

// userSchema.pre('save', async function(next){
//     const user = this
//     if(!user.isModified('password')) return next()
//     try {
//         const salt =  await bcrypt.genSalt(10)
//         const hashPassword = await bcrypt.hash(user.password, salt)
//         user.password = hashPassword
//         next()
//     } catch (error) {
//         return next(error)
//     }
// })

userSchema.methods.comparePassword = async function(password){
    console.log(password, this.password)
    return await bcrypt.compare(this.password, password)
}

const User = mongoose.model('User', userSchema)

export default User