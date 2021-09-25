import React, { useState, useEffect, createContext, Fragment } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Notification, { notify } from "react-notify-bootstrap";

// create the uploaded results context
export const UploadedResultsContext = createContext();

// provides uploaded results to the components
export const UploadedResultsProvider = (props) => {
	const [uploadedResults, setUploadedResults] = useState(null);

	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	useEffect(() => {
		let token = Cookies.get("lecturer_access_token");
		axios
			.get("/lecturers/uploadedResults", {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setUploadedResults(msg); // msg is the uploaded results array
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Fragment>
			<UploadedResultsContext.Provider
				value={[uploadedResults, setUploadedResults]}>
				{props.children}
			</UploadedResultsContext.Provider>
			<Notification />
		</Fragment>
	);
};
