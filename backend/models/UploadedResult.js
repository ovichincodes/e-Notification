const mongoose = require("mongoose");
// this model will have just the course, the session
// and an array of the results which will be read into another
// table from an excel file

// uploadResult schema
const uploadResultSchema = mongoose.Schema(
	{
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		department: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Department",
			required: true,
		},
		level: {
			type: Number,
			required: true,
		},
		semester: {
			type: Number,
			required: true,
		},
		session: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Session",
			required: true,
		},
		lecturer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Lecturer",
			required: true,
		},
		// one to many relationship with results schema
		results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
	},
	{ timestamps: true }
);
let UploadedResult = (module.exports = mongoose.model(
	"UploadedResult",
	uploadResultSchema
));
