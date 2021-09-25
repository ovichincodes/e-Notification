import React, { useContext } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	CardBody,
	CardTitle,
	Table,
} from "reactstrap";
import axios from "axios";
import moment from "moment";
import Notification, { notify } from "react-notify-bootstrap";
import AddCourseModal from "./AddCourseModal";
import { CourseContext } from "./CourseContext";
import Cookies from "js-cookie";

// courses to loop through and display on the table
const SingleCourse = ({ cnt, title, code, createdAt, id, deleteCourse }) => (
	<tr>
		<td>{cnt}</td>
		<td>{title}</td>
		<td>{code}</td>
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td>
			<span
				className='btn btn-sm btn-danger'
				onClick={() => {
					deleteCourse(id);
				}}>
				<i className='fa fa-times' aria-hidden='true'></i>
			</span>
		</td>
	</tr>
);

// the main functional component
const Courses = () => {
	const [courses, setCourses] = useContext(CourseContext);

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// delete a course
	const deleteCourse = (id) => {
		const token = Cookies.get("admin_access_token");
		axios
			.delete(`/admin/courses/delete/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setCourses(courses.filter((course) => course._id !== id));
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	};

	// set the courses to the body of the table
	const allCourses = () => {
		return React.Children.toArray(
			courses &&
				courses.map((course, index) => {
					return (
						<SingleCourse
							id={course._id}
							title={course.title}
							code={course.code}
							createdAt={course.createdAt}
							deleteCourse={deleteCourse}
							key={course._id}
							cnt={index + 1}
						/>
					);
				})
		);
	};

	return (
		<React.Fragment>
			<Container>
				<Row className='mb-1'>
					<Col sm='12' lg={{ offset: 1, size: 10 }}>
						<Card className='my-5'>
							<CardBody>
								<CardTitle tag='h5'>
									Available Courses
									<AddCourseModal />
								</CardTitle>
								{(courses && courses.length === 0) ||
								courses === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Courses Added!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>Title</th>
												<th>Code</th>
												<th>Date Added</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allCourses()}</tbody>
									</Table>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			<Notification />
		</React.Fragment>
	);
};

export default Courses;
