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
} from "reactstrap";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import NavBar from "./NavBar";
import auth from "./auth/Auth";

class LoginForm extends Component {
	state = {
		regno: "",
		password: "",
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
		let { regno, password } = this.state;
		if (regno === "" || password === "") {
			this.sendNotification({
				text: "All Fields are required",
				type: "danger",
			});
		} else {
			axios
				.post("/students/login", {
					regno,
					password,
				})
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						let { token, name } = res.data;
						localStorage.setItem("std_name", name);
						this.setState({ regno: "" });
						this.setState({ password: "" });
						this.sendNotification({ text: msg, type: "success" });
						auth.login(token, () => {
							this.props.history.push("/results");
						});
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

	render() {
		return (
			<Fragment>
				<NavBar active='login' />
				<Container>
					<Row>
						<Col
							sm='12'
							md={{ offset: 1, size: 10 }}
							lg={{ offset: 2, size: 8 }}>
							<Card>
								<CardBody>
									<CardTitle
										className='text-center mb-4'
										tag='h5'>
										Student's Login
									</CardTitle>
									<Form onSubmit={this.onSubmit}>
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
											color='dark'
											style={{ marginTop: "2rem" }}
											block>
											Login
										</Button>
									</Form>
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

export default LoginForm;
