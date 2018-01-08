'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const{TEST_DATABASE_URL} = require('../config');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Protected endpoint', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

  describe('/api/habits/protected', function() {
    it('Should reject requests with no credentials', function() {
      return chai
        .request(app)
        .get(`/api/habits/protected`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should reject requests with an invalid token', function() {
      const token = jwt.sign(
        {
          username,
          firstName,
          lastName
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .get('/api/habits/protected')
        .set('Authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an expired token', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .get('/api/habits/protected')
        .set('authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    
    it('Should create a new habit', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .post(`/api/habits/`)
        .set('authorization', `Bearer ${token}`)
        .send({
          streak: [], 
          habitTitle: "testHabit",
          goodOrBad: "good",
          goal: "2",
          logInterval: "per week",
          startDate: "12-12-2017",
          userRef: '507f1f77bcf86cd799439011',
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            '__v',
            '_id',
            'startDate',
            'userRef',
            'habitTitle',
            'logInterval',
            'goal',
            'goodOrBad',
            'streak'
            );
          expect(res.body.userRef).to.equal("507f1f77bcf86cd799439011");
          expect(res.body.habitTitle).to.equal('testHabit');
          expect(res.body.startDate).to.equal('12-12-2017');
          expect(res.body.logInterval).to.equal('per week');
          expect(res.body.goal).to.equal(2);
          expect(res.body.goodOrBad).to.equal('good');
          expect(res.body.streak).to.be.an('array');

        });
    });

    it('Should send protected data', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/api/habits/protected')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.equal('protected data');
        });
    });


    it('Should delete a habit', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .post('/api/habits/protected')
        .set('authorization', `Bearer ${token}`)
        .send({workoutName: 'deleteThisWorkout', userRef: '507f1f77bcf86cd799439012'})
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            '__v',
            '_id',
            'startDate',
            'userRef',
            'habitTitle',
            'logInterval',
            'goal',
            'goodOrBad',
            'streak'
            );
        });

    const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      return chai
      .request(app)
      .delete('/api/habits/protected')
      .set('authorization', `Bearer ${token}`)
      .send({workoutName: 'deleteThisWorkout'})
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.equal(
          'Item Removed'
          );
  });
});