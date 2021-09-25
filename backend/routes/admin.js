const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Cryptr = require("cryptr");
// init cryptr with the secret key
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
const auth = require("../middleware/auth");

// models
const Admin = require("../models/Admin");
const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");
const Course = require("../models/Course");

// @route	GET admin/register
// @desc	Register admin details ....use this to register the admin in order to add courses, departments and sessions
// @access	Public
router.post('/register').post((req, res) => {
	let { username, password } = req.body;
	let admin = new Admin({
		username,
		password,
	});
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(admin.password, salt, (err, hash) => {
			if (err) {
				admin.password = admin.password;
			} else {
				admin.password = hash;
				admin
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
});

// @route	GET admin/login
// @desc	Login admin
// @access	Public
router.route("/login").post((req, res) => {
	let { username, password } = req.body;
	// Match the username
	let query = { username };
	
	Admin.findOne(query)
		.then((admin) => {
			if (!admin) {
				return res.status(200).json({
					isCompleted: false,
					msg: "Invalid Username!",
				});
			}
			// Match the Password
			bcrypt.compare(password, admin.password, (err, isMatched) => {
				if (err) {
					return res.status(200).json({
						isCompleted: false,
						msg: err,
					});
				}
				// check if there's a matched admin within the admin collection
				if (isMatched) {
					// encrypt the user id
					const encryptedString = cryptr.encrypt(admin._id);
					res.status(200).json({
						isCompleted: true,
						token: encryptedString,
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

// @route	POST admin/lecturers/course/assign
// @desc	Assign courses to lecturers
// @access	Private
router.route("/lecturers/course/assign").post(auth, (req, res) => {
	let { courseId, LecturerId } = req.body;
	// find course by the course id and update the lecturer to the lecturer id
	Course.findByIdAndUpdate(
		courseId,
		{ lecturer: LecturerId },
		{ useFindAndModify: false }
	)
		.then(() => {
			// add the course id to the courses array of the lecturers model
			Lecturer.findById(LecturerId)
				.then((lecturer) => {
					// check if the course to be assigned to the
					// lecturer has already been assigned to this lecturer
					const currentCourses = lecturer.courses;
					const checkCourses = currentCourses.filter(
						(courseID) => parseInt(courseID) !== parseInt(courseId)
					);
					if (checkCourses.length > 0) {
						res.status(200).json({
							isCompleted: false,
							msg:
								"This course has already been assigned to this lecturer!",
						});
					} else {
						lecturer.courses.push(courseId);
						lecturer.save((err) => {
							if (err) {
								res.status(200).json({
									isCompleted: false,
									msg: err,
								});
							} else {
								res.status(200).json({
									isCompleted: true,
									msg: "Course Assigned Successfully!",
								});
							}
						});
					}
				})
				.catch((err) => {
					res.status(200).json({
						isCompleted: false,
						msg: err,
					});
				});
		})
		.catch((err) => {
			res.status(200).json({
				isCompleted: false,
				msg: err,
			});
		});
});

// @route	DELETE admin/lecturers/delete/:id
// @desc	Delete single lecturer
// @access	Private
router.route("/lecturers/delete/:id").delete(auth, (req, res) => {
	let id = req.params.id;
	Lecturer.findByIdAndDelete(id)
		.then(() =>
			res.status(200).json({
				isCompleted: true,
				msg: "Lecturer Deleted Successfully!",
			})
		)
		.catch((err) =>
			res.status(200).json({
				isCompleted: false,
				msg: "Error: " + err,
			})
		);
});

// @route	GET admin/lecturers
// @desc	Fetch all lecturers
// @access	Private
router.route("/lecturers/").get(auth, (req, res) => {
	Lecturer.find({}, null, { sort: { fname: 1 } })
		.populate("courses", null, null)
		.exec()
		.then((lecturers) =>
			res.status(200).json({ isCompleted: true, msg: lecturers })
		)
		.catch((err) =>
			res.status(200).json({
				isCompleted: false,
				msg: "Error: " + err,
			})
		);
});

// @route	DELETE admin/students/delete/:id
// @desc	Delete single student
// @access	Private
router.route("/students/delete/:id").delete(auth, (req, res) => {
	let id = req.params.id;
	Student.findByIdAndDelete(id)
		.then(() =>
			res.status(200).json({
				isCompleted: true,
				msg: "Student Deleted Successfully!",
			})
		)
		.catch((err) =>
			res.status(200).json({
				isCompleted: false,
				msg: "Error: " + err,
			})
		);
});

// @route	GET admin/students
// @desc	Fetch all students
// @access	Private
router.route("/students/").get(auth, (req, res) => {
	Student.find({}, null, { sort: { fname: 1 } })
		.populate("department", null, null)
		.exec()
		.then((students) =>
			res.status(200).json({ isCompleted: true, msg: students })
		)
		.catch((err) =>
			res.status(200).json({
				isCompleted: false,
				msg: "Error: " + err,
			})
		);
});

// @route	GET admin/
// @desc	Get the admin data
// @access	Private
router.route("/").get(auth, (req, res) => {
	Admin.findById(req.user_id)
		.select("-password")
		.then((admin) => res.json(admin));
});

module.exports = router;
