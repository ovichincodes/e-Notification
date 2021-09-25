import React, { Fragment, useContext } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	CardBody,
	CardTitle,
	Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import Cookies from "js-cookie";
import moment from "moment";
import NavBar from "../NavBar";
import { UploadedResultsContext } from "./UploadedResultsContext";
import NewUploadModal from "./NewUploadModal";
import Cryptr from "cryptr";
const cryptr = new Cryptr("xxsecretxx");

// uploaded results to loop through and display on the table
const SingleUploadedResult = ({
	cnt,
	course,
	session,
	department,
	level,
	semester,
	createdAt,
	id,
	lecturer,
	lec_id,
	deleteResult,
}) => (
	<tr>
		<td>{cnt}</td>
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
		<td>{department.name}</td>
		<td>{session.session}</td>
		<td>{semester === 1 ? "First" : "Second"}</td>
		<td>{course.code}</td>
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td>
			<Link
				className='btn btn-sm btn-info mr-2'
				to={`/lecturer/results/${id}/${course.code}`}>
				<i className='fa fa-eye' aria-hidden='true'></i>
			</Link>
			<span
				style={{ display: lecturer !== lec_id ? "none" : "inline" }}
				className='btn btn-sm btn-danger'
				onClick={() => {
					deleteResult(id);
				}}>
				<i className='fa fa-times' aria-hidden='true'></i>
			</span>
		</td>
	</tr>
);

const Results = () => {
	const [uploadedResults, setUploadedResults] = useContext(
		UploadedResultsContext
	);

	// set the uploaded results to the body of the table
	const allUploadedResults = () => {
		let token = Cookies.get("lecturer_access_token");
		let lec_id = cryptr.decrypt(token);
		return React.Children.toArray(
			uploadedResults &&
				uploadedResults.map((result, index) => {
					return (
						<SingleUploadedResult
							id={result._id}
							course={result.course}
							session={result.session}
							department={result.department}
							level={result.level}
							semester={result.semester}
							lecturer={result.lecturer}
							lec_id={lec_id}
							createdAt={result.createdAt}
							deleteResult={deleteResult}
							cnt={index + 1}
						/>
					);
				})
		);
	};

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// delete an uploaded result
	const deleteResult = (id) => {
		let token = Cookies.get("lecturer_access_token");
		axios
			.delete(`/lecturers/results/uploaded/delete/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setUploadedResults(
						uploadedResults.filter((result) => result._id !== id)
					);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => sendNotification({ text: err, type: "danger" }));
	};

	return (
		<Fragment>
			<NavBar active='result' />
			<Container>
				<Row className='mb-5'>
					<Col sm='12' lg={{ offset: 1, size: 10 }}>
						<h4 className='text-center text-success mb-4'>
							Welcome back{" "}
							<strong>{localStorage.getItem("lec_name")}!</strong>
						</h4>
						<Card className='mb-5'>
							<CardBody>
								<CardTitle tag='h5'>
									All Uploaded Results
									<NewUploadModal />
								</CardTitle>
								{(uploadedResults &&
									uploadedResults.length === 0) ||
								uploadedResults === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Results Uploaded!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>Level</th>
												<th>Department</th>
												<th>Session</th>
												<th>Semester</th>
												<th>Course</th>
												<th>Date Added</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allUploadedResults()}</tbody>
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

export default Results;
