const nodemailer = require("nodemailer");

// bring in the student model
const Student = require("../models/Student");

module.exports = ({ title, code, level }) => {
	let concatenated_emails = "";
	Student.find({ level }, (err, students) => {
		if (err) {
			throw err;
		} else {
			// concatenate emails together
			students.forEach(
				(std) => (concatenated_emails += std.email + ", ")
			);
			// remove the space and the comma after the last concatenated email
			concatenated_emails = concatenated_emails.slice(0, -1).slice(0, -1);
			console.log(concatenated_emails);
			const output = `
                    <h4>Hey Dear,</h4>
                    <br>
                    <p>
                        <strong>${title}</strong> with the course code <strong>${code}</strong> has just been uploaded.
                    </p>
                    <p>Click the Login button below to view your result!</p>
                    <a href="http://localhost:3000/" style="
                        font-weight: 600;
                        letter-spacing: .03em;
                        font-size: 0.8125rem;
                        min-width: 2.375rem;
                        padding: 0.375rem 0.75rem;
                        border-radius: 3px;
                        margin-top: 0.75rem !important;
                        color: #fff;
                        background-color: #316cbe;
                        border-color: #2f66b3;">
                        Login
                    </a>
                    <br>
                `;
			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true, // true for 465, false for other ports
				auth: {
					user: `${process.env.EMAIL_USER}`, // generated ethereal user
					pass: `${process.env.EMAIL_PASSWORD}`, // generated ethereal password
				},
				rejectUnauthorized: false,
			});
			// send mail with defined transport object
			transporter.sendMail(
				{
					from:
						`'Result Notification System <${process.env.EMAIL_USER}>'`, // sender address
					to: concatenated_emails, // list of receivers
					subject: "Result Notification", // Subject line
					text: "", // plain text body
					html: output, // html body
				},
				(err, info) => {
					if (err) {
						return console.log(err);
					}
					console.log("Message sent: %s", info.messageId);
					console.log(
						"Preview URL: %s",
						nodemailer.getTestMessageUrl(info)
					);
				}
			);
		}
	});
};
