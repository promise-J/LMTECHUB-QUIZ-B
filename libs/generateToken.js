import jwt from 'jsonwebtoken'

export function generateToken(user, res){
    const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: '1h'})
    res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60  * 1000
    })
    return token
}