const model = require('../models/users');
const express = require('express');
const router = express.Router();

router
    .get('/', (req, res, next) => {

        model.getAll().then((data) => {
            res.send(data)
        }).catch(next)

    })

    .get('/search/:loginData', (req, res, next) => { 
       const loginData = req.params

       model.getByLogin(loginData).then((data) => {
        
         // Make sure not to send password to client - sensitive information
            
         const safeUser = {...data[0], password: undefined}
         data[0] = safeUser

         res.status(201).json({
             data: data,
             message: 'User found successfully',
             isSuccess: true
         })   
       })
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params

        model.get(id).then((data) => {

            // Make sure not to send password to client - sensitive information
            
            const safeUser = {...data[0], password: undefined}
            data[0] = safeUser

            res.status(201).json({
                data: data,
                message: 'User found successfully',
                isSuccess: true
            })   
        }).catch(next)

    })
    .post('/', (req, res, next) => {
        const newValues = req.body

        model.create(newValues).then((data) => {
        
        // Make sure not to send password to client - sensitive information

        const safeUser = {...data[0], password: undefined}
        data[0] = safeUser

            res.status(201).json({
                data: data,
                message: 'User created successfully',
                isSuccess: true
            })
        }).catch(next)

    })
    .patch('/:id', (req, res, next) => {
        const { id } = req.params
        const newValues = req.body

        model.update(id, newValues).then((data) => {
            res.send(data)
        }).catch(next)

    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params

        model.remove(id).then((data) => {
            res.send(data)
        }).catch(next)
    })

module.exports = router