import jwt from 'jsonwebtoken';   
const { sign, verify } = jwt;

export function generateAccessToken(userid, isAdmin) {
    try {
        const token = sign({ userid, isAdmin }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
        return token
    }
    catch (err) {
        console.error('Error generating access token:', err)
    }
}

export function verifyAccessToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({
            message: 'Access token is required',
            isSuccess: false
        })
    }
    
    try {
        const decoded = verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({
            message: 'Invalid or expired token',
            isSuccess: false
        })
    }
}

export function verifyAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            message: 'Admin access required',
            isSuccess: false
        })
    }
    next()
}
