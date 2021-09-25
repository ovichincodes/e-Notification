import React, { useState, useEffect, createContext, Fragment } from "react";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import Cookies from "js-cookie";

// create the lecturer context
export const LecturerContext = createContext();

// provides lecturer to the components
export const LecturerProvider = (props) => {
	const [lecturers, setLecturers] = useState(null);

	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	useEffect(() => {
		const token = Cookies.get("admin_access_token");
		axios
			.get("/admin/lecturers", { headers: { "x-auth-token": token } })
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setLecturers(msg); // msg is the lecturers array
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Fragment>
			<LecturerContext.Provider value={[lecturers, setLecturers]}>
				{props.children}
			</LecturerContext.Provider>
			<Notification />
		</Fragment>
	);
};
