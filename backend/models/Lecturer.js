const mongoose = require("mongoose");

// lecturer schema
const lecturerSchema = mongoose.Schema(
	{
		fname: {
			type: String,
			required: true,
		},
		lname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		// one to many relationship with courses schema
		courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
	},
	{ timestamps: true }
);
let Lecturer = (module.exports = mongoose.model("Lecturer", lecturerSchema));
