import jwt from 'jsonwebtoken';   const { sign, verify } = jwt;

export function generateAccessToken(userid) {
    try {
        const token = sign({ userid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
        return token
    }
    catch (err) {
        console.error('Error generating access token:', err)
    }
}