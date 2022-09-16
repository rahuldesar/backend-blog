const _ = require('lodash');

const dummy = (blogs)  =>{
  return 1 ;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => sum + current.likes, 0);
};

const favoriteBlog = (blogs) => {
  let favItem = blogs.find(item =>
    item.likes === Math.max(...blogs.map(item => item.likes))
  );
  return {
    title: favItem.title,
    author: favItem.author,
    likes: favItem.likes
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const a = _.groupBy(blogs, 'author')
  const b = _.mapValues(a, (arrayOfBlogs, author) => {
    return {
      author: author,
      blogs: arrayOfBlogs.length
    }
  })
  const c = _.map(b, key => key)
  return _.maxBy(c, 'blogs')
};



const mostLikes = (blogs) => {
  if(blogs.length === 0){
    return {};
  }
  const a = _.groupBy(blogs, 'author');

  const b = _.mapValues(a, (arrayOfBlogs, author) => {
    return{
      author : author,
      likes : arrayOfBlogs.map(blog => blog.likes).reduce((sum, item) => sum + item, 0)
    }
  })

  const c = _.map(b, key => key)
  return _.maxBy(c, 'likes')

};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};