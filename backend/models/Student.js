const mongoose = require("mongoose");

// student schema
const studentSchema = mongoose.Schema(
	{
		fname: {
			type: String,
			required: true,
		},
		lname: {
			type: String,
			required: true,
		},
		regno: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		level: {
			type: Number,
			required: true,
		},
		department: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Department",
			required: true,
		},
	},
	{ timestamps: true }
);
let Student = (module.exports = mongoose.model("Student", studentSchema));
