import React, { useState, useEffect, createContext, Fragment } from "react";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import Cookies from "js-cookie";

// create the department context
export const DepartmentContext = createContext();

// provides department to the components
export const DepartmentProvider = (props) => {
	const [departments, setDepartments] = useState(null);

	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	useEffect(() => {
		const token = Cookies.get("admin_access_token");
		axios
			.get("/admin/departments/", {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setDepartments(msg); // msg is the departments array
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Fragment>
			<DepartmentContext.Provider value={[departments, setDepartments]}>
				{props.children}
			</DepartmentContext.Provider>
			<Notification />
		</Fragment>
	);
};
