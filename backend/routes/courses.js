const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const { addNewCourses } = require("../validations");
const auth = require("../middleware/auth");

// models
const Course = require("../models/Course");

// add a new course
router.route("/add").post(addNewCourses, auth, (req, res) => {
	// Check Errors from the validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(200).json({
			isCompleted: false,
			msg: errors.array(),
		});
	} else {
		const { title, code } = req.body;
		let course = new Course({
			title,
			code,
		});
		// add new course
		course
			.save()
			.then(() => {
				Course.findById(course._id, (err, lastCourse) => {
					if (err) {
						res.status(200).json({
							isCompleted: false,
							msg: err,
						});
					} else {
						res.status(200).json({
							isCompleted: true,
							lastCourse,
							msg: "Course Added Successfully!",
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
	}
});

// delete a course
router.route("/delete/:id").delete(auth, (req, res) => {
	let id = req.params.id;
	Course.findByIdAndDelete(id)
		.then(() =>
			res.status(200).json({
				isCompleted: true,
				msg: "Course Deleted Successfully!",
			})
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// fetch all courses
router.route("/").get(auth, (req, res) => {
	Course.find()
		.sort({ title: 1 })
		.then((courses) =>
			res.status(200).json({ isCompleted: true, msg: courses })
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

module.exports = router;
