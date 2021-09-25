import React, { useState, useEffect, createContext, Fragment } from "react";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import Cookies from "js-cookie";

// create the student context
export const StudentContext = createContext();

// provides student to the components
export const StudentProvider = (props) => {
	const [students, setStudents] = useState(null);

	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	useEffect(() => {
		const token = Cookies.get("admin_access_token");
		axios
			.get("/admin/students", { headers: { "x-auth-token": token } })
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setStudents(msg); // msg is the students array
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Fragment>
			<StudentContext.Provider value={[students, setStudents]}>
				{props.children}
			</StudentContext.Provider>
			<Notification />
		</Fragment>
	);
};
