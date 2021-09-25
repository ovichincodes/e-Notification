const express = require("express");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const router = express.Router();
const {
	lecturersRegistration,
	updateLecturersProfile,
} = require("../validations");
const auth = require("../middleware/auth");
const Cryptr = require("cryptr");
// init cryptr with the secret key
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

// models
const Lecturer = require("../models/Lecturer");
const Course = require("../models/Course");
const Department = require("../models/Department");
const Session = require("../models/Session");

// @route	POST lecturers/register
// @desc	Register Lecturer
// @access	Public
router.route("/register").post(lecturersRegistration, (req, res) => {
	// Check Errors from the validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		res.status(200).json({
			isCompleted: false,
			msg: errors.array(),
		});
	} else {
		const { fname, lname, email, password } = req.body;
		let lecturer = new Lecturer({
			fname,
			lname,
			email,
			password,
		});
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(lecturer.password, salt, (err, hash) => {
				if (err) {
					lecturer.password = lecturer.password;
				} else {
					lecturer.password = hash;
					lecturer
						.save()
						.then(() => {
							res.status(200).json({
								isCompleted: true,
								msg: "Registration Successful!",
							});
						})
						.catch((err) => {
							res.status(200).json({
								isCompleted: false,
								msg: err,
							});
						});
				}
			});
		});
	}
});

// @route	GET lecturers/login
// @desc	Login a lecturer
// @access	Public
router.route("/login").post((req, res) => {
	let { email, password } = req.body;
	// Match the email
	let query = { email };
	Lecturer.findOne(query)
		.then((lecturer) => {
			if (!lecturer) {
				return res.status(200).json({
					isCompleted: false,
					msg: "Invalid Email Address!",
				});
			}
			// Match the Password
			bcrypt.compare(password, lecturer.password, (err, isMatched) => {
				if (err) {
					return res.status(200).json({
						isCompleted: false,
						msg: err,
					});
				}
				// check if there's a matched lecturer within the lecturer collection
				if (isMatched) {
					// encrypt the user id
					const encryptedString = cryptr.encrypt(lecturer._id);
					res.status(200).json({
						isCompleted: true,
						token: encryptedString,
						name: `${lecturer.fname} ${lecturer.lname}`,
						msg: "Login Successful!",
					});
				} else {
					res.status(200).json({
						isCompleted: false,
						msg: "Invalid Password!",
					});
				}
			});
		})
		.catch((err) => {
			res.status(200).json({
				isCompleted: false,
				msg: err,
			});
		});
});

// @route	GET lecturers/getFormDetails
// @desc	Get form details for result upload
// @access	Private
router.route("/getFormDetails").get(auth, (req, res) => {
	// get courses assigned to this lecturer
	const courses = new Promise((resolve, reject) => {
		Lecturer.findById(req.user_id)
			.populate("courses", null, null, null, { title: 1 })
			.then((lecturer) => resolve(lecturer.courses))
			.catch((err) => reject(err));
	});
	// get departments
	const departments = new Promise((resolve, reject) => {
		Department.find()
			.sort({ name: 1 })
			.then((departments) => resolve(departments))
			.catch((err) => reject(err));
	});
	// get sessions
	const sessions = new Promise((resolve, reject) => {
		Session.find()
			.sort({ session: -1 })
			.then((sessions) => resolve(sessions))
			.catch((err) => reject(err));
	});

	// get the values from the three promises
	Promise.all([courses, departments, sessions])
		.then((values) =>
			res.status(200).json({
				isCompleted: true,
				msg: values,
			})
		)
		.catch((err) => {
			res.status(200).json({
				isCompleted: false,
				msg: "Error: " + err,
			});
		});
});

// @route	POST students/profile
// @desc	Update the profile details of the lecturer
// @access	Private
router.route("/profile").post(updateLecturersProfile, auth, (req, res) => {
	let { fname, lname, email } = req.body;
	// find the lecturer and update
	Lecturer.findByIdAndUpdate(
		req.user_id,
		{ fname, lname, email },
		{ useFindAndModify: false }
	)
		.then(() => {
			res.status(200).json({
				isCompleted: true,
				msg: "Profile Updated Successful!",
			});
		})
		.catch((err) => {
			res.status(200).json({
				isCompleted: false,
				msg: err,
			});
		});
});

// @route	GET lecturers/departments
// @desc	Get all the departments
// @access	Public
router.route("/departments").get((req, res) => {
	Department.find()
		.sort({ name: 1 })
		.then((departments) =>
			res.status(200).json({ isCompleted: true, msg: departments })
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// @route	GET lecturers/lecturer
// @desc	Get the current lecturer data
// @access	Private
router.route("/lecturer").get(auth, (req, res) => {
	Lecturer.findById(req.user_id)
		.select("-password")
		.then((lecturer) => res.json(lecturer));
});

module.exports = router;
