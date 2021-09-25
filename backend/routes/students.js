const express = require("express");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const router = express.Router();
const {
	studentsRegistration,
	updateStudentsProfile,
} = require("../validations");
const auth = require("../middleware/auth");
const Cryptr = require("cryptr");
// init cryptr with the secret key
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

// models
const Student = require("../models/Student");
const Session = require("../models/Session");
const Result = require("../models/Result");

// @route	GET students/register
// @desc	Regiser a student
// @access	Public
router.route("/register").post(studentsRegistration, (req, res) => {
	// Check Errors from the validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(200).json({
			isCompleted: false,
			msg: errors.array(),
		});
	} else {
		const {
			fname,
			lname,
			regno,
			email,
			phone,
			password,
			department,
			level,
		} = req.body;
		let student = new Student({
			fname,
			lname,
			regno,
			email,
			phone,
			password,
			department,
			level,
		});

		// hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(student.password, salt, (err, hash) => {
				if (err) {
					student.password = student.password;
				} else {
					student.password = hash;
					student
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

// @route	GET students/login
// @desc	Login a student
// @access	Public
router.route("/login").post((req, res) => {
	let { regno, password } = req.body;
	// Match the regno
	let query = { regno };
	Student.findOne(query)
		.then((student) => {
			if (!student) {
				return res.status(200).json({
					isCompleted: false,
					msg: "Invalid Registration Number!",
				});
			}
			// Match the Password
			bcrypt.compare(password, student.password, (err, isMatched) => {
				if (err) {
					return res.status(200).json({
						isCompleted: false,
						msg: err,
					});
				}
				// check if there's a matched student within the student collection
				if (isMatched) {
					// encrypt the user id
					const encryptedString = cryptr.encrypt(student._id);
					res.status(200).json({
						isCompleted: true,
						token: encryptedString,
						name: `${student.fname} ${student.lname}`,
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

// @route	POST students/profile
// @desc	Update the email and phone number of the student
// @access	Private
router.route("/profile").post(updateStudentsProfile, auth, (req, res) => {
	let { email, phone, level } = req.body;
	// find the student and update
	Student.findByIdAndUpdate(
		req.user_id,
		{ email, phone, level },
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

// @route	GET students/sessions
// @desc	Get all the sessions
// @access	Public
router.route("/sessions").get((req, res) => {
	Session.find()
		.sort({ session: -1 })
		.then((sessions) =>
			res.status(200).json({ isCompleted: true, msg: sessions })
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// @route	POST students/results
// @desc	Get all students results for a session's semester
// @access	Private
router.route("/results").post(auth, (req, res) => {
	const { semester, session } = req.body;
	const id = req.user_id;
	Student.findById(id)
		.then((student) => {
			Result.find({ regno: student.regno }, null, { sort: {} })
				.populate({
					path: "uploadedResult",
					populate: { path: "course" },
				})
				.exec()
				.then((allresults) => {
					if (allresults.length > 0) {
						const results = allresults.filter(
							(res) =>
								res.uploadedResult.department.toString() ===
									student.department.toString() &&
								res.uploadedResult.session.toString() ===
									session.toString() &&
								res.uploadedResult.semester.toString() ===
									semester.toString() &&
								res.uploadedResult.level.toString() ===
									student.level.toString()
						);
						res.status(200).json({
							isCompleted: true,
							msg: results,
						});
					} else {
						res.status(200).json({
							isCompleted: false,
							msg: "No Results Found!",
						});
					}
				})
				.catch((err) =>
					res
						.status(200)
						.json({ isCompleted: false, msg: "Error: " + err })
				);
		})
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// @route	GET students/student
// @desc	Get the current student data
// @access	Private
router.route("/student").get(auth, (req, res) => {
	Student.findById(req.user_id)
		.select("-password")
		.then((student) => res.json(student));
});

module.exports = router;
