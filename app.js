const config = require('./utils/config');
const express = require('express');
const app = express();
// const cors = require('cors');
const blogRouter = require('./controllers/blog');
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

app.get('/', (request, response) => {
  response.send('hello world');
});

app.use('/api/blogs', blogRouter);


module.exports = app;

