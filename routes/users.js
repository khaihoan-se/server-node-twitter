const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
// const notificationsControllers = require('../controllers/notifications');
// const postsControllers = require('../controllers/posts');
const { fileUpload } = require('../middleware/file-upload');
// const checkAuth = require('../middleware/check-auth');
require('dotenv').config;
const { CLIENT_URL } = process.env;

const userCtrl = require('../controllers/users')


router.post('/signup', userCtrl.signup)


module.exports = router;