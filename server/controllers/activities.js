const model = require('../models/activities');
const express = require('express');
const router = express.Router();
const { verifyAccessToken, verifyAdmin } = require('../middleware/verifyJWT');

router
    // Get all activities - admin can see all, users can only see their own
    .get('/', (req, res, next) => {
        if (req.user.isAdmin) {
            model.getAll().then((data) => {
                res.status(200).json({
                    data: data.data,
                    count: data.count,
                    message: 'Activities retrieved successfully',
                    isSuccess: true
                })
            }).catch(next)
        } else {
            model.getByUserId(req.user.userid).then((data) => {
                res.status(200).json({
                    data: data,
                    message: 'Activities retrieved successfully',
                    isSuccess: true
                })
            }).catch(next)
        }
    })
    
    // Get activity by ID - users can only access their own activities
    .get('/:id', (req, res, next) => {
        const { id } = req.params

        model.get(id).then((data) => {
            // Check if the activity belongs to the user or user is admin
            if (data[0].userId !== req.user.userid && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'You are not authorized to access this activity',
                    isSuccess: false
                })
            }
            
            res.status(200).json({
                data: data,
                message: 'Activity retrieved successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    
    // Create a new activity
    .post('/', (req, res, next) => {
        const newValues = req.body
        
        // Ensure the userId in the activity matches the authenticated user
        // unless the user is an admin
        if (newValues.userId !== req.user.userid && !req.user.isAdmin) {
            return res.status(403).json({
                message: 'You can only create activities for yourself',
                isSuccess: false
            })
        }

        model.create(newValues).then((data) => {
            res.status(201).json({
                data: data,
                message: 'Activity created successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    
    // Update an activity
    .patch('/:id', (req, res, next) => {
        const { id } = req.params
        const newValues = req.body

        // First get the activity to check ownership
        model.get(id).then((activity) => {
            // Check if the activity belongs to the user or user is admin
            if (activity[0].userId !== req.user.userid && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'You are not authorized to update this activity',
                    isSuccess: false
                })
            }
            
            // Proceed with update
            model.update(id, newValues).then((data) => {
                res.status(200).json({
                    data: data,
                    message: 'Activity updated successfully',
                    isSuccess: true
                })
            }).catch(next)
        }).catch(next)
    })
    
    // Delete an activity
    .delete('/:id', (req, res, next) => {
        const { id } = req.params

        // First get the activity to check ownership
        model.get(id).then((activity) => {
            // Check if the activity belongs to the user or user is admin
            if (activity[0].userId !== req.user.userid && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'You are not authorized to delete this activity',
                    isSuccess: false
                })
            }
            
            // Proceed with delete
            model.remove(id).then(() => {
                res.status(200).json({
                    message: 'Activity deleted successfully',
                    isSuccess: true
                })
            }).catch(next)
        }).catch(next)
    })

module.exports = router
