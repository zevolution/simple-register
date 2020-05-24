const express = require('express');

const AuthController = require('./app/controllers/AuthController');
const asyncHandler = require('express-async-handler');
const authMiddleware = require('./app/middlewares/auth');

const routes = new express.Router();

routes.post('/auth/register', asyncHandler(AuthController.register));
routes.post('/auth/authenticate', asyncHandler(AuthController.authenticate));
routes.post('/auth/forgot-password', asyncHandler(AuthController.forgotPassword));
routes.post('/auth/reset-password', asyncHandler(AuthController.resetPassword));

routes.use(authMiddleware);
routes.get('/auth/last-change-password', asyncHandler(AuthController.lastChangePassword));

module.exports = routes;