import React, { Fragment, useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	CardBody,
	CardTitle,
	Table,
} from "reactstrap";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import Notification, { notify } from "react-notify-bootstrap";
import NavBar from "../NavBar";
import Cryptr from "cryptr";
const cryptr = new Cryptr("xxsecretxx");

// functional component
// show to looped results in the body of the table
const Result = ({
	cnt,
	name,
	regno,
	quiz,
	exam,
	total,
	grade,
	remark,
	lecturer,
	lec_id,
	createdAt,
	deleteResult,
	id,
}) => (
	<tr>
		<td>{cnt}</td>
		<td>{name}</td>
		<td>{regno}</td>
		<td>{quiz}</td>
		<td>{exam}</td>
		<td>{total}</td>
		<td className='text-center'>
			<strong>{grade}</strong>
		</td>
		<td>{remark}</td>
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td className='text-center'>
			{lecturer === lec_id ? (
				<span
					className='btn btn-sm btn-danger'
					onClick={() => {
						deleteResult(id);
					}}>
					<i className='fa fa-times' aria-hidden='true'></i>
				</span>
			) : (
				<strong className='text-danger'>Nil</strong>
			)}
		</td>
	</tr>
);

const SingleResult = () => {
	const [results, setResults] = useState(null);

	// set the results to the body of the table
	const allResults = () => {
		let token = Cookies.get("lecturer_access_token");
		let lec_id = cryptr.decrypt(token);
		return React.Children.toArray(
			results &&
				results.map((result, index) => {
					return (
						<Result
							id={result._id}
							name={result.name}
							regno={result.regno}
							quiz={result.quizScore}
							exam={result.examScore}
							total={result.totalScore}
							grade={result.grade}
							remark={result.remark}
							lecturer={result.uploadedResult.lecturer}
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

	// delete single results
	const deleteResult = (resid) => {
		let token = Cookies.get("lecturer_access_token");
		axios
			.delete(`/lecturers/results/delete/${resid}/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setResults(
						results.filter((result) => result._id !== resid)
					);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => sendNotification({ text: err, type: "danger" }));
	};

	// get the id and course parameter from the url
	let { id, course } = useParams();
	// get the results for this course
	useEffect(() => {
		let token = Cookies.get("lecturer_access_token");
		axios
			.get(`/lecturers/results/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					setResults(msg);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => sendNotification({ text: err, type: "danger" }));
	}, [id]);

	return (
		<Fragment>
			<NavBar />
			<Container>
				<Row className='mb-5'>
					<Col sm='12' lg='12'>
						<h4 className='text-center text-success mb-4'>
							Welcome back{" "}
							<strong>{localStorage.getItem("lec_name")}!</strong>
						</h4>
						<Card className='mb-5'>
							<CardBody>
								<CardTitle
									tag='h4'
									className={classnames("text-center")}>
									{`${course} Results`}
								</CardTitle>
								{(results && results.length === 0) ||
								results === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Results For this Course!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>Name</th>
												<th>Registration Number</th>
												<th>Quiz</th>
												<th>Exams</th>
												<th>Total</th>
												<th>Grade</th>
												<th>Remark</th>
												<th>Date Added</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allResults()}</tbody>
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

export default SingleResult;
