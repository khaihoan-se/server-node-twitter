
const { validationResult } = require('express-validator');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { generateFromEmail } = require('unique-username-generator')
const TwitterStrategy = require('passport-twitter').Strategy;
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const { GOOGLE_API_KEY, JWT_KEY, GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;
const client = new OAuth2Client(GOOGLE_API_KEY);
const HttpError = require('../models/http-error');
const Users = require('../models/user');
// const Post = require('../models/post');
const { fileUpload } = require('../middleware/file-upload');
const { createJWTtoken } = require('../utils');
const DEFAULT_AVATAR = 'https://res.cloudinary.com/devstylea/image/upload/v1664359082/fallback_profile_sgxnrc.png';

const { uploadToCloudinary, validateEmail, validatePassword, createAccessToken, createRefreshToken } = require('../utils');


const userCtrl = {
   signup: async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
         );
      }

      const { name, username, email, password } = req.body
  
      if(!name || !email || !password) return next(new HttpError('Please fill all fields', 400))

      
      const user_email = await Users.findOne({ email })
      if(user_email) return next(new HttpError('This user name already exists.', 400))
      if(!validateEmail(email)) return next(new HttpError('Invalid emails.'), 400)
      const newUserName = !username ? generateFromEmail(email, 3) : username.toLowerCase().replace(/ /g, '')
      
      if(!validatePassword(password)) return next(new HttpError('Minimum of eight characters, at least one uppercase, one lowercase and one special character.', 400))
      const passwordHash = await bcrypt.hash(password, 12)

      const newUser = new Users({
         name, username: newUserName, email, password: passwordHash
      })

      const access_token = createAccessToken({id: newUser._id, email: newUser.email})
      const refresh_token = createRefreshToken({id: newUser._id, email: newUser.email})

      res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30*24*60*60*1000 // 30days
      })

      res.status(201).json({
         user: {
           name: newUser.name,
           userId: newUser.id,
           email: newUser.email,
           username: newUser.username,
           access_token,
         },
      });
   }
}

module.exports = userCtrl