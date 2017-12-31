'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {User} = require('../users/models');
const {Habit} = require('../habits/models');

const router = express.Router();

const jsonParser = bodyParser.json();

//add a new workout
router.post('/', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Habit
		.create({
			habitTitle: req.body.habitTitle,
			loggedDate: req.body.loggedDate,
			userRef: req.body.userRef,
			goodOrBad: req.body.goodOrBad,
			goal: req.body.goal,
			logInterval: req.body.logInterval
			})
        .then(habit => res.status(201).json(habit))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};