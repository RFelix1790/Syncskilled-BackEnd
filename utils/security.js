import bcrypt from 'bcrypt'

const ROUNDS = 12

export async function hashPassword(plain) {
    if(typeof plain !== 'string' || plain.length < 8){
        throw new Error('Password must be at least 8 characters')
    }
    return bcrypt.hash(plain, ROUNDS)
}

export async function comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed)
}