const request = require("request");

// bring in the student model
const Student = require("../models/Student");

module.exports = ({ title, code, level }) => {
	let concatenated_phones = "";
	Student.find({ level }, (err, students) => {
		if (err) {
			throw err;
		} else {
			// concatenate phone numbers together
			students.forEach(
				(std) => (concatenated_phones += std.phone + ", ")
			);
			// remove the space and the comma after the last concatenated phone
			concatenated_phones = concatenated_phones.slice(0, -1).slice(0, -1);
			let sms_body = `Hey Dear, ${title} with the course code ${code} has just been uploaded.`;
			// make the request
			request(
				`${process.env.BULKSMS_BASE_URL}?api_token=${process.env.SMS_API_KEY}&from=${process.env.EMAIL_SENDER_ID}&to=${concatenated_phones}&body=${sms_body}`,
				(error, response, body) => {
					if (!error && response.statusCode == 200) {
						console.log(body);
					}
				}
			);
		}
	});
};
