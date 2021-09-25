const mongoose = require("mongoose");

// departments schema
const departmentsSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
let Department = (module.exports = mongoose.model(
	"Department",
	departmentsSchema
));
