const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  // const noteObject = helper.initialNotes
  //   .map(note => new Note(note));
  // const promiseArray = noteObject.map(note => note.save());
  // await Promise.all(promiseArray);
  // console.log('done');

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }

});


test('blogs are returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('total number of blogs are read.', async() => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('the first blog is about React Patterns', async() => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].title).toBe('React patterns');
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');

  const blogContents = response.body.map(r => r.title);
  expect(blogContents).toContain(
    'Canonical string reduction'
  );
});

test('a valid blog can be added with HTTP POST request', async() => {
  const newBlog = {
    title: 'LATEST React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '6325d00a4391d0fbacb09a45',
  };

  await api
    .post('/api/blogs')
    .set('authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QyIiwiaWQiOiI2MzI1ZTg3MWI0NzU5MmE4ZDYxMTYyOTciLCJpYXQiOjE2NjM0Mjg3Njh9.jFjIK2Gj1kKskhkR7pv-JwOCz_6tSUaImvgp_gnKTao')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const blogContents = blogsAtEnd.map(n => n.title);
  expect(blogContents).toContain(
    'LATEST React patterns'
  );
});

test('a specific note can be viewed', async() => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

  expect (resultBlog.body).toEqual(processedBlogToView);
});

// test('a note can be deleted', async() => {
//   const notesAtStart = await helper.notesInDb();

//   const noteToDelete = notesAtStart[0];

//   await api
//     .delete(`/api/notes/${noteToDelete.id}`)
//     .expect(204);

//   const notesAtEnd = await helper.notesInDb();

//   expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

//   const contents = notesAtEnd.map(r => r.content);
//   expect(contents).not.toContain(noteToDelete.content);
// });


test('the unique identifier property of the blog is named id', async( ) => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];
  expect(blogToView.id).toBeDefined();
});

test('default value of likes is 0, if value of likes is missing', async() => {
  const blogFromStart = await helper.blogsInDb();

  const blogWithoutLikes = blogFromStart[5];

  const resultBlog = await api.get(`/api/blogs/${blogWithoutLikes.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultBlog.body.likes).toBeDefined();
  expect(resultBlog.body.likes).toBe(0);
});

test('a invalid blog (without title) POST shows error', async() => {
  const newBlog = {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('a invalid blog (without url) POST shows error', async() => {
  const newBlog = {
    title : 'react patterns',
    author: 'Michael Chan',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    );

    const blogContents = blogsAtEnd.map(r => r.title);

    expect(blogContents).not.toContain(blogToDelete.title);
  });
});


describe('update of a blog', () => {
  test('updating likes on a post', async() => {
    const newBlog = {
      id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 10,
    };

    await api
      .put(`/api/blogs/${newBlog.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});





afterAll(() => {
  mongoose.connection.close();
});
