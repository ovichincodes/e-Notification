import React, { Component, Fragment } from "react";
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Container,
	Row,
	Col,
	Card,
	CardBody,
	CardTitle,
	Table,
} from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import Notification, { notify } from "react-notify-bootstrap";
import NavBar from "./NavBar";

// functional component
// show to looped results in the body of the table
const Result = ({ cnt, course, quiz, exam, total, grade, remark, id }) => (
	<tr>
		<td>{cnt}</td>
		<td>{course.title}</td>
		<td>{quiz}</td>
		<td>{exam}</td>
		<td>{total}</td>
		<td>{grade}</td>
		<td>{remark}</td>
	</tr>
);

class ResultsForm extends Component {
	state = {
		session: "",
		semester: "",
		results: null,
		sessions: null,
	};

	// set the state on change of the form values
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	// display messages
	sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the login form
	onSubmit = (e) => {
		e.preventDefault();
		let { semester, session } = this.state;
		if (semester === "" || session === "") {
			this.sendNotification({
				text: "All Fields are required!",
				type: "danger",
			});
		} else {
			let token = Cookies.get("std_access_token");
			axios
				.post(
					"/students/results",
					{ semester, session },
					{
						headers: { "x-auth-token": token },
					}
				)
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						this.setState({ results: msg });
						document.getElementById("resultForm").style.display =
							"none";
						document.getElementById("mainResults").style.display =
							"block";
					} else {
						this.sendNotification({ text: msg, type: "danger" });
					}
				})
				.catch((err) =>
					this.sendNotification({ text: err.Error, type: "danger" })
				);
		}
	};

	// set the results to the body of the table
	allResults = () => {
		return React.Children.toArray(
			this.state.results &&
				this.state.results.map((result, index) => {
					return (
						<Result
							id={result._id}
							course={result.uploadedResult.course}
							quiz={result.quizScore}
							exam={result.examScore}
							total={result.totalScore}
							grade={result.grade}
							remark={result.remark}
							cnt={index + 1}
						/>
					);
				})
		);
	};

	componentDidMount() {
		axios
			.get("/students/sessions")
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					this.setState({ sessions: msg });
				} else {
					this.sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) =>
				this.sendNotification({ text: err.Error, type: "danger" })
			);
	}

	render() {
		return (
			<Fragment>
				<NavBar active='result' />
				<Container>
					<Row className='mb-5'>
						<Col
							sm='12'
							md={{ offset: 1, size: 10 }}
							lg={{ offset: 2, size: 8 }}>
							<h4 className='text-center text-success mb-4'>
								Welcome back{" "}
								<strong>
									{localStorage.getItem("std_name")}!
								</strong>
							</h4>
							<Card id='resultForm'>
								<CardBody>
									<CardTitle
										className='text-center mb-4'
										tag='h5'>
										Results Form
									</CardTitle>
									<Form onSubmit={this.onSubmit}>
										<FormGroup>
											<Label for='session'>Session</Label>
											<Input
												type='select'
												name='session'
												id='session'
												value={this.state.session}
												onChange={this.onChange}
												required>
												<option value=''>
													Choose...
												</option>
												{this.state.sessions &&
													this.state.sessions.map(
														(session) => {
															return React.Children.toArray(
																<option
																	value={
																		session._id
																	}>
																	{
																		session.session
																	}
																</option>
															);
														}
													)}
											</Input>
										</FormGroup>
										<FormGroup>
											<Label for='Semester'>
												Semester
											</Label>
											<Input
												type='select'
												name='semester'
												id='semester'
												value={this.state.semester}
												onChange={this.onChange}
												required>
												<option value=''>
													Choose...
												</option>
												<option value='1'>First</option>
												<option value='2'>
													Second
												</option>
											</Input>
										</FormGroup>
										<Button
											color='success'
											style={{ marginTop: "2rem" }}
											block>
											Proceed
										</Button>
									</Form>
								</CardBody>
							</Card>
							<Card id='mainResults' style={{ display: "none" }}>
								<CardBody>
									<CardTitle
										className='text-center mb-4'
										tag='h5'>
										Available Results
									</CardTitle>
									{(this.state.results &&
										this.state.results.length === 0) ||
									this.state.results === null ? (
										<h4 className='text-center text-danger mt-4'>
											No Results Available Yet!
										</h4>
									) : (
										<Table
											responsive
											hover
											className='mt-4'>
											<thead>
												<tr>
													<th>#</th>
													<th>Course</th>
													<th>Quiz</th>
													<th>Exams</th>
													<th>Total</th>
													<th>Grade</th>
													<th>Remark</th>
												</tr>
											</thead>
											<tbody>{this.allResults()}</tbody>
										</Table>
									)}
									<p className='text-center'>
										<Button
											className='mr-1'
											type='button'
											color='danger'
											style={{ marginTop: "2rem" }}
											onClick={() => {
												this.setState({
													results: null,
													session: "",
													semester: "",
												});
												document.getElementById(
													"mainResults"
												).style.display = "none";
												document.getElementById(
													"resultForm"
												).style.display = "block";
											}}>
											Back
										</Button>
										<Button
											className='ml-1'
											type='button'
											color='success'
											style={{
												marginTop: "2rem",
												display:
													(this.state.results &&
														this.state.results
															.length === 0) ||
													this.state.results === null
														? "none"
														: "inline",
											}}>
											Print
										</Button>
									</p>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
				<Notification />
			</Fragment>
		);
	}
}

export default ResultsForm;
