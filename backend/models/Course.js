const mongoose = require("mongoose");

// courses schema
const coursesSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		// one to one relationship with lecturer
		lecturer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Lecturer",
		},
	},
	{ timestamps: true }
);
let Course = (module.exports = mongoose.model("Course", coursesSchema));
