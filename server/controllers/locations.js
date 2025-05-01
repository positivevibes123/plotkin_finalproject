const model = require('../models/locations');
const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/verifyJWT');

router
    // Get all locations - admin can see all, users can only see their own
    .get('/', verifyAccessToken, (req, res, next) => {
        if (req.user.isAdmin) {
            model.getAll().then((data) => {
                res.status(200).json({
                    data: data.data,
                    count: data.count,
                    message: 'Locations retrieved successfully',
                    isSuccess: true
                })
            }).catch(next)
        } else {
            res.status(403).json({
                message: 'Admin access required',
                isSuccess: false
            })
        }
    })
    
    // Get locations for a specific user
    .get('/user/:id', verifyAccessToken, (req, res, next) => {
        const { id } = req.params
        
        // Check if the user is requesting their own data or is an admin
        if (req.user.userid != id && !req.user.isAdmin) {
            return res.status(403).json({
                message: 'You are not authorized to access this data',
                isSuccess: false
            })
        }
        
        model.getByUserId(id).then((data) => {
            res.status(200).json({
                data: data,
                message: 'Locations retrieved successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    
    // Get a specific location by ID
    .get('/:id', verifyAccessToken, (req, res, next) => {
        const { id } = req.params

        model.get(id).then((data) => {
            // Check if the location belongs to the user or user is admin
            if (data[0].userId !== req.user.userid && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'You are not authorized to access this location',
                    isSuccess: false
                })
            }
            
            res.status(200).json({
                data: data[0],
                message: 'Location retrieved successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    
    // Create a new location
    .post('/', verifyAccessToken, (req, res, next) => {
        const newValues = req.body
        
        // Ensure the userId in the location matches the authenticated user
        // unless the user is an admin
        if (newValues.userId !== req.user.userid && !req.user.isAdmin) {
            return res.status(403).json({
                message: 'You can only create locations for yourself',
                isSuccess: false
            })
        }

        model.create(newValues).then((data) => {
            res.status(201).json({
                data: data[0],
                message: 'Location created successfully',
                isSuccess: true
            })
        }).catch(next)
    })
    
    // Update a location
    .patch('/:id', verifyAccessToken, (req, res, next) => {
        const { id } = req.params
        const newValues = req.body

        // First get the location to check ownership
        model.get(id).then((location) => {
            // Check if the location belongs to the user or user is admin
            if (location[0].userId !== req.user.userid && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'You are not authorized to update this location',
                    isSuccess: false
                })
            }
            
            // Proceed with update
            model.update(id, newValues).then((data) => {
                res.status(200).json({
                    data: data[0],
                    message: 'Location updated successfully',
                    isSuccess: true
                })
            }).catch(next)
        }).catch(next)
    })
    
    // Delete a location
    .delete('/:id', verifyAccessToken, (req, res, next) => {
        const { id } = req.params

        // First get the location to check ownership
        model.get(id).then((location) => {
            // Check if the location belongs to the user or user is admin
            if (location[0].userId !== req.user.userid && !req.user.isAdmin) {
                return res.status(403).json({
                    message: 'You are not authorized to delete this location',
                    isSuccess: false
                })
            }
            
            // Proceed with delete
            model.remove(id).then(() => {
                res.status(200).json({
                    message: 'Location deleted successfully',
                    isSuccess: true
                })
            }).catch(next)
        }).catch(next)
    })

module.exports = router
