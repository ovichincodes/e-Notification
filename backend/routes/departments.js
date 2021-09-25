const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const { addNewDepartments } = require("../validations");
const auth = require("../middleware/auth");

// models
const Department = require("../models/Department");

// add a new department
router.route("/add").post(addNewDepartments, auth, (req, res) => {
	// Check Errors from the validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(200).json({
			isCompleted: false,
			msg: errors.array(),
		});
	} else {
		const { name } = req.body;
		let newDepartment = new Department({
			name,
		});
		// add new department
		newDepartment
			.save()
			.then(() => {
				Department.findById(
					newDepartment._id,
					(err, lastDepartment) => {
						if (err) {
							res.status(200).json({
								isCompleted: false,
								msg: err,
							});
						} else {
							res.status(200).json({
								isCompleted: true,
								lastDepartment,
								msg: "Department Added Successfully!",
							});
						}
					}
				);
			})
			.catch((err) => {
				res.status(200).json({
					isCompleted: false,
					msg: err,
				});
			});
	}
});

// delete a department
router.route("/delete/:id").delete(auth, (req, res) => {
	let id = req.params.id;
	Department.findByIdAndDelete(id)
		.then(() =>
			res.status(200).json({
				isCompleted: true,
				msg: "Department Deleted Successfully!",
			})
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// fetch all departments
router.route("/").get(auth, (req, res) => {
	Department.find()
		.sort({ name: 1 })
		.then((departments) =>
			res.status(200).json({ isCompleted: true, msg: departments })
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

module.exports = router;
