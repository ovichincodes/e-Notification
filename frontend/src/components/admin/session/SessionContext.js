import React, { useState, useEffect, createContext, Fragment } from "react";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import Cookies from "js-cookie";

// create the session context
export const SessionContext = createContext();

// provides sessions to the components
export const SessionProvider = (props) => {
	const [sessions, setSessions] = useState(null);

	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	useEffect(() => {
		const token = Cookies.get("admin_access_token");
		axios
			.get("/admin/sessions/", {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setSessions(msg); // msg is the sessions array
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Fragment>
			<SessionContext.Provider value={[sessions, setSessions]}>
				{props.children}
			</SessionContext.Provider>
			<Notification />
		</Fragment>
	);
};
