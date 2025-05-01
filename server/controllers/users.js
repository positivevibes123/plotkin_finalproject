const model = require('../models/users');
const express = require('express');
const router = express.Router();
const { generateAccessToken, verifyAccessToken, verifyAdmin } = require('../middleware/verifyJWT') 

router
    .get('/', verifyAccessToken, verifyAdmin, (req, res, next) => {
        model.getAll().then((data) => {
            res.status(200).json({
                data: data.data,
                count: data.count,
                message: 'Users retrieved successfully',
                isSuccess: true
            })
        }).catch(next)
    })

    .post('/login', (req, res, next) => { 
       const loginData = req.body

       model.login(loginData).then((data) => {
         // Make sure not to send password to client - sensitive information
         const token = generateAccessToken(data[0].userid, data[0].isadmin)

         res.status(200).json({
             data: token,
             message: 'User logged in successfully',
             isSuccess: true
         })   
       }).catch(next)
    })


    .get('/:id', verifyAccessToken, (req, res, next) => {
        const { id } = req.params
        
        // Check if user is requesting their own data or is an admin
        if (req.user.userid != id && !req.user.isAdmin) {
            return res.status(403).json({
                message: 'You are not authorized to access this user data',
                isSuccess: false
            })
        }

        model.get(id).then((data) => {
            // Make sure not to send password to client - sensitive information
            const safeUser = {...data[0], password: undefined}

            res.status(200).json({
                data: [safeUser],
                message: 'User found successfully',
                isSuccess: true
            })   
        }).catch(next)
    })
    .post('/', (req, res, next) => {
        const newValues = req.body

        model.create(newValues).then((data) => {
            // Generate token with isAdmin flag
            const token = generateAccessToken(data[0].userid, data[0].isadmin)

            res.status(201).json({
                data: token,
                message: 'User created successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    .patch('/:id', verifyAccessToken, (req, res, next) => {
        const { id } = req.params
        const newValues = req.body
        
        // Check if user is updating their own data or is an admin
        if (req.user.userid != id && !req.user.isAdmin) {
            return res.status(403).json({
                message: 'You are not authorized to update this user',
                isSuccess: false
            })
        }

        model.update(id, newValues).then((data) => {
            // Remove password from response
            const safeUser = data.map(user => ({...user, password: undefined}))
            
            res.status(200).json({
                data: safeUser,
                message: 'User updated successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    
    .delete('/:id', verifyAccessToken, verifyAdmin, (req, res, next) => {
        const { id } = req.params

        model.remove(id).then((data) => {
            res.status(200).json({
                message: 'User deleted successfully',
                isSuccess: true
            })
        }).catch(next)
    })

module.exports = router
