const blogRouter = require('express').Router();
const Blog = require('../models/blog');


blogRouter.get('/', async (request, response ) => {
  const blogs = await Blog.find({});
  response.json(blogs);

});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  console.log(blog);
  if(!blog.title || !blog.url) {
    response.status(400).end();
  }
  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.get('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id);
  if(blog){
    response.json(blog);
  } else {
    response.status(404).end();
  }
});


blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});

module.exports = blogRouter;