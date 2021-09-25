const mongoose = require("mongoose");

// session schema
const sessionSchema = mongoose.Schema(
	{
		session: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
let Session = (module.exports = mongoose.model("Session", sessionSchema));
