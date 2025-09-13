import jwt from 'jsonwebtoken'

const accessSecret = process.env.JWT_ACCESS_SECRET
const refreshSecret = process.env.JWT_REFRESH_SECRET
const accessExp = process.env.ACCESS_TOKEN_EXPIRES
const refreshExp = process.env.REFRESH_TOKEN_EXPIRES

export function signAccessToken(payload){
    return jwt.sign(payload, accessSecret, {expiresIn: accessExp})
}

export function signRefreshToken(payload){
    return jwt.sign(payload, refreshSecret, {expiresIn: refreshExp})
}

export function verifyAccessToken(token){
    return jwt.verify(token, accessSecret)
}

export function verifyRefreshToken(token){
    return jwt.verify(token, refreshSecret)
}
