const mongoose = require("mongoose");

// result schema
const resultSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		regno: {
			type: String,
			required: true,
		},
		quizScore: {
			type: String,
			required: true,
		},
		examScore: {
			type: String,
			required: true,
		},
		totalScore: {
			type: String,
			required: true,
		},
		grade: {
			type: String,
			required: true,
		},
		remark: {
			type: String,
			required: true,
		},
		uploadedResult: {
			// one to one relationship with UploadedResult
			type: mongoose.Schema.Types.ObjectId,
			ref: "UploadedResult",
		},
	},
	{ timestamps: true }
);
let Result = (module.exports = mongoose.model("Result", resultSchema));
