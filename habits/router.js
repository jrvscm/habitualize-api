'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {User} = require('../users/models');
const {Habit} = require('../habits/models');

const router = express.Router();

const jsonParser = bodyParser.json();

//add a new habit
router.post('/', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Habit
		.create({
			streak: req.body.streak,
			habitTitle: req.body.habitTitle,
			loggedDate: req.body.loggedDate,
			userRef: req.body.userRef,
			goodOrBad: req.body.goodOrBad,
			goal: req.body.goal,
			logInterval: req.body.logInterval,
			startDate: req.body.startDate
			})
        .then(habit => res.status(201).json(habit))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//get all habits for a user
router.get('/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Habit
		.find({userRef: req.params.id})
        .then(habits => res.status(200).json(habits.map(habit => habit)))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//update a habit by id
router.put('/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Habit
		.findOneAndUpdate({_id: req.params.id}, {$set: {streak: req.body.streak}}, {new: true})
        .then(habit => res.status(200).json(habit))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//get habit by id
router.get('/current/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Habit
		.find({_id: req.params.id})
        .then(habit => res.status(200).json(habit))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//delete habit by id
router.delete('/delete/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Habit
		.findByIdAndRemove(req.params.id)
        .then(() => res.status(204).json({message:'Item Removed'}))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});
module.exports = {router};