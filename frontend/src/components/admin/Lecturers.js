import React, { Fragment } from "react";
import { LecturerProvider } from "./lecturer/LecturerContext";
import AdminLecturers from "./lecturer/Lecturers";

const Lecturers = () => {
	return (
		<Fragment>
			<LecturerProvider>
				<AdminLecturers />
			</LecturerProvider>
		</Fragment>
	);
};

export default Lecturers;
