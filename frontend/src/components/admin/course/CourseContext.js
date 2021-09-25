import React, { useState, useEffect, createContext, Fragment } from "react";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import Cookies from "js-cookie";

// create the course context
export const CourseContext = createContext();

// provides course to the components
export const CourseProvider = (props) => {
	const [courses, setCourses] = useState(null);

	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	useEffect(() => {
		const token = Cookies.get("admin_access_token");
		axios
			.get("/admin/courses/", { headers: { "x-auth-token": token } })
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setCourses(msg); // msg is the courses array
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Fragment>
			<CourseContext.Provider value={[courses, setCourses]}>
				{props.children}
			</CourseContext.Provider>
			<Notification />
		</Fragment>
	);
};
