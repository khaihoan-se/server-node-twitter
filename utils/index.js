const jwt = require('jsonwebtoken');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const path = require('path');
require('dotenv').config();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = async (file, type) => {
  try {
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);

    const uploadedResponse = await cloudinary.uploader.upload(file64.content, {
      resource_type: type,
      upload_preset: 'twitter-clone',
    });
    return uploadedResponse.url;
  } catch (err) {
    console.log(err);
  }
}

const createJWTtoken = (id, email) => {
  let jwtToken;
  try {
    jwtToken = jwt.sign(
      //takes payload (the data you want to encode)
      { userId: id, email: email },
      JWT_KEY,
      { expiresIn: '1h' } //token expires in 1 hr
    );
  } catch (err) {
    console.log(err); //return err ('Signup failed, please try again', 500)
    //'Login failed, please try again', 500)
  }
  return jwtToken;
};

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{8,}$/;
  return re.test(password);
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

exports.uploadToCloudinary = uploadToCloudinary;
exports.createJWTtoken = createJWTtoken;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;