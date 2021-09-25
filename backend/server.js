const express = require("express");
const dotenv = require("dotenv");

// init express
const app = express();

// init the .env file
dotenv.config({ path: "./config/.env" });

// bring in  database connection
require("./config/database");

// Initialize the body parse middleware
app.use(express.json({ limit: "50MB" })); // handle raw json
app.use(express.urlencoded({ extended: false, limit: "5MB" })); // handle form submission

// Test if the email is working
// app.get("/test", (req, res) => {
	// require("./config/email")({
	// 	title: "Computer Performance Evaluation",
	// 	code: "CIS454",
	// 	level: 3,
	// });
	// require("./config/sms")({
	// 	title: "Computer Performance Evaluation",
	// 	code: "CIS454",
	// 	level: 3,
	// });
// });

// routes
app.use("/admin/courses", require("./routes/courses"));
app.use("/admin/departments", require("./routes/departments"));
app.use("/admin/sessions", require("./routes/sessions"));
app.use("/admin", require("./routes/admin"));
app.use("/students", require("./routes/students"));
app.use("/lecturers", require("./routes/lecturers"));
app.use("/lecturers", require("./routes/results"));

const PORT = process.env.PORT || process.env.APP_PORT;

// let app listen on the port
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}...`));
