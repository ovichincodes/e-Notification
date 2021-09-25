import React, { Fragment } from "react";
import { StudentProvider } from "./student/StudentContext";
import AdminStudents from "./student/Students";

const Students = () => {
	return (
		<Fragment>
			<StudentProvider>
				<AdminStudents />
			</StudentProvider>
		</Fragment>
	);
};

export default Students;
