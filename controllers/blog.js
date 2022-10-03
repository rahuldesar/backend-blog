const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response ) => {
  const blogs = await Blog.find({}).populate('user',{ username:1 , name : 1 });
  response.json(blogs);

});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;

  if(!blog.title || !blog.url) {
    response.status(400).end();
  }

  const newBlog = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: user._id,
    comments: blog.comments,
  });


  const result = await newBlog.save()
    .then(result => result.populate('user',{ username:1 , name : 1 }));
  user.blogs = user.blogs.concat(result._id);
  await user.save();
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

  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if(!blog.user.equals(user.id)){
    console.log(user.id, request.params, blog.user);
    return response.status(401).json({
      error : 'Invalid Token. You don\'t have access for this action.',
    });
  }
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
    user: body.user,
    comments: body.comments,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(incompletelyUpdatedBlog =>
      incompletelyUpdatedBlog.populate('user',{ username:1 , name : 1 })
    )
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});

module.exports = blogRouter;