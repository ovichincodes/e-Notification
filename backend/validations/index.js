const { check } = require("express-validator");
// models
const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");

module.exports = {
	// validate the student registration request
	studentsRegistration: [
		check("fname")
			.not()
			.isEmpty()
			.trim()
			.withMessage("First Name is Required!"),
		check("lname")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Last Name is Required!"),
		check("regno")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Registration Number is Required!"),
		check("email").not().isEmpty().trim().withMessage("Email is Required!"),
		check("email").isEmail().withMessage("Invalid Email Format!"),
		check("email").custom((value, { req }) => {
			return new Promise((resolve, reject) => {
				Student.findOne({ email: req.body.email }, (err, student) => {
					if (err) {
						reject("Server Error");
					}
					if (Boolean(student)) {
						reject(
							"<i className='fa fa-exclamation-circle'></i> E-mail already exist!"
						);
					}
					resolve(true);
				});
			});
		}),
		check("phone")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Phone Number is Required!"),
		check("phone")
			.isLength({ min: 11, max: 11 })
			.withMessage("Invalid Phone Number!"),
		check("password").not().isEmpty().withMessage("Password is Required!"),
		check("password")
			.isLength({ min: 6 })
			.withMessage(
				"Password must be greater than or equal to 6 characters!"
			),
		check("department")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Department is Required!"),
	],

	// validate the lecturers registration request
	lecturersRegistration: [
		check("fname")
			.not()
			.isEmpty()
			.trim()
			.withMessage("First Name is Required!"),
		check("lname")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Last Name is Required!"),
		check("email").not().isEmpty().trim().withMessage("Email is Required!"),
		check("email").isEmail().withMessage("Invalid Email Format!"),
		check("email").custom((value, { req }) => {
			return new Promise((resolve, reject) => {
				Lecturer.findOne({ email: req.body.email }, (err, student) => {
					if (err) {
						reject("Server Error");
					}
					if (Boolean(student)) {
						reject(
							"<i className='fa fa-exclamation-circle'></i> E-mail already exist!"
						);
					}
					resolve(true);
				});
			});
		}),
		check("password").not().isEmpty().withMessage("Password is Required!"),
		check("password")
			.isLength({ min: 6 })
			.withMessage(
				"Password must be greater than or equal to 6 characters!"
			),
	],

	// validate the admin addition of new course request
	addNewCourses: [
		check("title")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Course Title is Required!"),
		check("code")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Course Code is Required!"),
		check("code")
			.isAlphanumeric()
			.withMessage("Course Code must be Alphanumeric!"),
	],

	// validate the admin addition of new session request
	addNewSessions: [
		check("session")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Session Title is Required!"),
	],

	// validate the admin addition of new department request
	addNewDepartments: [
		check("name")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Department Name is Required!"),
	],

	// update the students email and password
	updateStudentsProfile: [
		check("email").not().isEmpty().trim().withMessage("Email is Required!"),
		check("email").isEmail().withMessage("Invalid Email Format!"),
		check("phone")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Phone Number is Required!"),
		check("phone")
			.isLength({ min: 11, max: 11 })
			.withMessage("Invalid Phone Number!"),
		check("level").not().isEmpty().trim().withMessage("Level is Required!"),
	],

	// update the lecturers fname, lname and email
	updateLecturersProfile: [
		check("fname")
			.not()
			.isEmpty()
			.trim()
			.withMessage("First Name is Required!"),
		check("lname")
			.not()
			.isEmpty()
			.trim()
			.withMessage("Last Name is Required!"),
		check("email").not().isEmpty().trim().withMessage("Email is Required!"),
		check("email").isEmail().withMessage("Invalid Email Format!"),
	],
};
