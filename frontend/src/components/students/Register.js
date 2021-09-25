import React, { Component } from "react";
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
} from "reactstrap";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import NavBar from "./NavBar";

class Register extends Component {
	state = {
		fname: "",
		lname: "",
		email: "",
		phone: "",
		regno: "",
		password: "",
		department: "",
		level: "",
		departments: null,
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
		// validate form
		let {
			fname,
			lname,
			email,
			phone,
			regno,
			password,
			department,
			level,
		} = this.state;
		if (
			fname === "" ||
			lname === "" ||
			email === "" ||
			phone === "" ||
			regno === "" ||
			password === "" ||
			department === "" ||
			level === ""
		) {
			this.sendNotification({
				text: "All Fields are required!",
				type: "danger",
			});
		} else {
			axios
				.post("/students/register", {
					fname,
					lname,
					email,
					phone,
					regno,
					password,
					department,
					level,
				})
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						this.setState({
							fname: "",
							lname: "",
							email: "",
							phone: "",
							regno: "",
							password: "",
							department: "",
							level: "",
						});
						this.sendNotification({ text: msg, type: "success" });
						window.location.assign("/");
					} else {
						if (typeof msg === "object") {
							this.sendNotification({
								text: "Error occured!",
								type: "danger",
							});
						} else {
							this.sendNotification({
								text: msg,
								type: "danger",
							});
						}
					}
				})
				.catch((err) =>
					this.sendNotification({ text: err, type: "danger" })
				);
		}
	};

	componentDidMount() {
		axios
			.get("/lecturers/departments")
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					this.setState({ departments: msg });
				} else {
					this.sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) =>
				this.sendNotification({ text: err, type: "danger" })
			);
	}

	render() {
		return (
			<React.Fragment>
				<NavBar active='register' />
				<Container>
					<Row className='mb-5'>
						<Col
							sm='12'
							md={{ offset: 1, size: 10 }}
							lg={{ offset: 2, size: 8 }}>
							<Card className='mb-5'>
								<CardBody>
									<CardTitle className='text-center' tag='h5'>
										Student's Registration Form
									</CardTitle>
									<Form onSubmit={this.onSubmit}>
										<FormGroup>
											<Label for='fname'>
												First Name
											</Label>
											<Input
												type='text'
												name='fname'
												id='fname'
												placeholder='First Name'
												className='mb-3'
												value={this.state.fname}
												onChange={this.onChange}
												required
											/>
										</FormGroup>
										<FormGroup>
											<Label for='lname'>Last Name</Label>
											<Input
												type='text'
												name='lname'
												id='lname'
												placeholder='Last Name'
												className='mb-3'
												value={this.state.lname}
												onChange={this.onChange}
												required
											/>
										</FormGroup>
										<FormGroup>
											<Label for='regno'>
												Registration Number
											</Label>
											<Input
												type='text'
												name='regno'
												id='regno'
												placeholder='Registration Number'
												className='mb-3'
												value={this.state.regno}
												onChange={this.onChange}
												required
											/>
										</FormGroup>
										<FormGroup>
											<Label for='email'>Email</Label>
											<Input
												type='email'
												name='email'
												id='email'
												placeholder='Email'
												className='mb-3'
												value={this.state.email}
												onChange={this.onChange}
											/>
										</FormGroup>
										<FormGroup>
											<Label for='department'>
												Department
											</Label>
											<Input
												type='select'
												name='department'
												id='department'
												value={this.state.department}
												onChange={this.onChange}
												required>
												<option value=''>
													Choose...
												</option>
												{this.state.departments &&
													this.state.departments.map(
														(dept) => {
															return React.Children.toArray(
																<option
																	value={
																		dept._id
																	}>
																	{dept.name}
																</option>
															);
														}
													)}
											</Input>
										</FormGroup>
										<FormGroup>
											<Label for='level'>Level</Label>
											<Input
												type='select'
												name='level'
												id='level'
												value={this.state.level}
												onChange={this.onChange}
												required>
												<option value=''>
													Choose...
												</option>
												<option value='1'>100</option>
												<option value='2'>200</option>
												<option value='3'>300</option>
												<option value='4'>400</option>
												<option value='5'>500</option>
												<option value='6'>600</option>
											</Input>
										</FormGroup>
										<FormGroup>
											<Label for='phone'>
												Phone Number
											</Label>
											<Input
												type='tel'
												name='phone'
												id='phone'
												placeholder='Phone Number'
												className='mb-3'
												value={this.state.phone}
												onChange={this.onChange}
											/>
										</FormGroup>
										<FormGroup>
											<Label for='password'>
												Password
											</Label>
											<Input
												type='password'
												name='password'
												id='password'
												placeholder='Password'
												value={this.state.password}
												onChange={this.onChange}
												required
											/>
										</FormGroup>
										<Button
											color='success'
											style={{ marginTop: "2rem" }}
											block>
											Register
										</Button>
									</Form>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
				<Notification />
			</React.Fragment>
		);
	}
}

export default Register;
