// const logger = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// const errorHandler = (error, request, response, next) => {
//   logger.error(error.message);

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' });
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message });
//   } else if (error.name === 'JsonWebTokenError') {
//     return response.status(400).json({ error: 'invalid token' });
//   } else if (error.name === 'TokenExpiredError') {
//     return response.status(400).json({ error: 'token expired' });
//   }

//   next(error);
// };

const tokenExtractor = (request, response , next ) =>{
  const authorization = request.get('authorization');
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    request.token =  authorization.substring(7);
  }

  next();
};

const userExtractor = async (request, response , next ) =>{
  // if(!decodedToken.id){
  //   return response.status(401).json({
  //     error : 'token missing or invalid'
  //   });
  // }
  if(request.token){
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    request.user = await User.findById(decodedToken.id);
    console.log(request.user);
  }
  next();
};


module.exports = {
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  requestLogger
};