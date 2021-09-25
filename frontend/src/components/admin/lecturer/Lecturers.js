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
import { LecturerContext } from "./LecturerContext";
import { CourseProvider } from "../course/CourseContext";
import AssignCoursesModal from "./AssignCoursesModal";
import Cookies from "js-cookie";

// lecturers to loop through and display on the table
const SingleLecturer = ({
	cnt,
	fname,
	lname,
	email,
	courses,
	createdAt,
	id,
	deleteLecturer,
}) => (
	<tr>
		<td>{cnt}</td>
		<td>{fname}</td>
		<td>{lname}</td>
		<td>{email}</td>
		{courses.length === 0 ? (
			<td className={classnames("text-danger")}>Nil</td>
		) : courses.length === 1 ? (
			<td className={classnames("text-success")}>{courses[0].code}</td>
		) : (
			<td className={classnames("text-success")}>
				{courses &&
					courses.map((course, index) => {
						return React.Children.toArray(
							<Fragment>
								<span>{course.code}</span>
								{index === courses.length - 1 ? (
									""
								) : (
									<span>, </span>
								)}
							</Fragment>
						);
					})}
			</td>
		)}
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td>
			<CourseProvider>
				<AssignCoursesModal LecturerId={id} />
			</CourseProvider>
			<span
				className='btn btn-sm btn-danger'
				onClick={() => {
					deleteLecturer(id);
				}}>
				<i className='fa fa-times' aria-hidden='true'></i>
			</span>
		</td>
	</tr>
);

const Lecturers = () => {
	const [lecturers, setLecturers] = useContext(LecturerContext);

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// delete a lecturer
	const deleteLecturer = (id) => {
		const token = Cookies.get("admin_access_token");
		axios
			.delete(`/admin/lecturers/delete/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setLecturers(
						lecturers.filter((lecturer) => lecturer._id !== id)
					);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => sendNotification({ text: err, type: "danger" }));
	};

	// set the lecturers to the body of the table
	const allLecturers = () => {
		return React.Children.toArray(
			lecturers &&
				lecturers.map((lecturer, index) => {
					return (
						<SingleLecturer
							id={lecturer._id}
							fname={lecturer.fname}
							lname={lecturer.lname}
							email={lecturer.email}
							courses={lecturer.courses}
							createdAt={lecturer.createdAt}
							deleteLecturer={deleteLecturer}
							cnt={index + 1}
						/>
					);
				})
		);
	};

	return (
		<Fragment>
			<NavBar active='lecturer' />
			<Container>
				<Row className='mb-5'>
					<Col sm='12' lg='12'>
						<h4 className='text-center mb-3'>ADMINISTRATOR</h4>
						<Card className='mb-5'>
							<CardBody>
								<CardTitle
									className={classnames("text-center")}
									tag='h3'>
									Registered Lecturers
								</CardTitle>
								{(lecturers && lecturers.length === 0) ||
								lecturers === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Lecturers Added!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>First Name</th>
												<th>Last Name</th>
												<th>Email</th>
												<th>Courses Assigned</th>
												<th>Date Registered</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allLecturers()}</tbody>
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

export default Lecturers;
