const config = require('./utils/config');

const express = require('express');
require('express-async-errors');
const app = express();


// const cors = require('cors');
const blogRouter = require('./controllers/blog');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

// const Blog = require('./models/blog');

const mongoose = require('mongoose');

console.log('APP => connecting to ', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('APP => CONNECTED TO MONGODB');
  })
  .catch((error) => {
    console.log('ERROR CONNECTING TO MONGODB: ', error.message);
  });

// app.use(cors);
app.use(express.json());
const middleware = require('./utils/middleware');
app.get('/', (request, response) => {
  response.send('hello world');
});

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);


app.use('/api/blogs', blogRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);



module.exports = app;

