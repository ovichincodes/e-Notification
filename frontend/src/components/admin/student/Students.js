import React, { Fragment, useContext } from "react";
import {
	Card,
	CardBody,
	CardTitle,
	Row,
	Col,
	Container,
	Table,
} from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import moment from "moment";
import Notification, { notify } from "react-notify-bootstrap";
import NavBar from "../NavBar";
import { StudentContext } from "./StudentContext";
import Cookies from "js-cookie";

// students to loop through and display on the table
const SingleStudent = ({
	cnt,
	fname,
	lname,
	email,
	regno,
	level,
	department,
	createdAt,
	id,
	deleteStudent,
}) => (
	<tr>
		<td>{cnt}</td>
		<td>{fname}</td>
		<td>{lname}</td>
		<td>{email}</td>
		<td>{regno}</td>
		<td>
			{level === 1
				? "100"
				: level === 2
				? "200"
				: level === 3
				? "300"
				: level === 4
				? "400"
				: level === 5
				? "500"
				: "600"}
		</td>
		<td>{department}</td>
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td>
			<span
				className='btn btn-sm btn-danger'
				onClick={() => {
					deleteStudent(id);
				}}>
				<i className='fa fa-times' aria-hidden='true'></i>
			</span>
		</td>
	</tr>
);

const Students = () => {
	const [students, setStudents] = useContext(StudentContext);

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// delete a student
	const deleteStudent = (id) => {
		const token = Cookies.get("admin_access_token");
		axios
			.delete(`/admin/students/delete/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setStudents(
						students.filter((student) => student._id !== id)
					);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => sendNotification({ text: err, type: "danger" }));
	};

	// set the students to the body of the table
	const allStudents = () => {
		return React.Children.toArray(
			students &&
				students.map((student, index) => {
					return (
						<SingleStudent
							id={student._id}
							fname={student.fname}
							lname={student.lname}
							email={student.email}
							regno={student.regno}
							level={student.level}
							department={student.department.name}
							createdAt={student.createdAt}
							deleteStudent={deleteStudent}
							cnt={index + 1}
						/>
					);
				})
		);
	};

	return (
		<Fragment>
			<NavBar active='student' />
			<Container>
				<Row className='mb-5'>
					<Col sm='12' lg='12'>
						<h4 className='text-center mb-3'>ADMINISTRATOR</h4>
						<Card className='mb-5'>
							<CardBody>
								<CardTitle
									className={classnames("text-center")}
									tag='h3'>
									Registered Students
								</CardTitle>
								{(students && students.length === 0) ||
								students === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Students Added!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>First Name</th>
												<th>Last Name</th>
												<th>Email</th>
												<th>Registration Number</th>
												<th>Level</th>
												<th>Department</th>
												<th>Date Registered</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allStudents()}</tbody>
									</Table>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			<Notification />
		</Fragment>
	);
};

export default Students;
