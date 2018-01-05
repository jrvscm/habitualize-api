'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const HabitSchema = mongoose.Schema({	
	streak: [], 
	habitTitle: {type: String, required: true},
	goodOrBad: {type: String, required: true},
	goal: {type: Number, required: true},
	logInterval: {type: String, required: true},
	startDate: {type: String, required: true},
	userRef: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	habitId: {type: mongoose.Schema.Types.ObjectId}
});

const Habit = mongoose.model('Habit', HabitSchema);
module.exports = {Habit};