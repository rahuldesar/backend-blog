const supertest = require('supertest');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async() => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({
      username : 'root',
      passwordHash
    });

    await user.save();
  });


  test('creation succeds with a fresh username', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username : 'rahuldesar',
      name : 'Rahul Deshar',
      password : 'test123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(a => a.username);
    expect(usernames).toContain(newUser.username);




  });

  test('creation fails with proper statuscode and message if username already taken', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username : 'root',
      name : 'Superuser',
      password : 'test1234'
    };
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username is too short', async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username : 'ro',
      name : 'Superuser',
      password : 'test1234'
    };
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Username and Password must be atleast 3 character long');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

});

afterAll(() => {
  mongoose.connection.close();
});