const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const { addNewSessions } = require("../validations");
const auth = require("../middleware/auth");

// models
const Session = require("../models/Session");

// add a new session
router.route("/add").post(addNewSessions, auth, (req, res) => {
	// Check Errors from the validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(200).json({
			isCompleted: false,
			msg: errors.array(),
		});
	} else {
		const { session } = req.body;
		let newSession = new Session({
			session,
		});
		// add new session
		newSession
			.save()
			.then(() => {
				Session.findById(newSession._id, (err, lastSession) => {
					if (err) {
						res.status(200).json({
							isCompleted: false,
							msg: err,
						});
					} else {
						res.status(200).json({
							isCompleted: true,
							lastSession,
							msg: "Session Added Successfully!",
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

// delete a session
router.route("/delete/:id").delete(auth, (req, res) => {
	let id = req.params.id;
	Session.findByIdAndDelete(id)
		.then(() =>
			res.status(200).json({
				isCompleted: true,
				msg: "Session Deleted Successfully!",
			})
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// fetch all sessions
router.route("/").get(auth, (req, res) => {
	Session.find()
		.sort({ session: -1 })
		.then((sessions) =>
			res.status(200).json({ isCompleted: true, msg: sessions })
		)
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

module.exports = router;
