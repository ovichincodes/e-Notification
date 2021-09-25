import React, { Fragment, useState } from "react";
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
import Notification, { notify } from "react-notify-bootstrap";
import axios from "axios";
import NavBar from "./NavBar";

const Register = () => {
	const [fname, setFname] = useState("");
	const [lname, setLname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// set the state on change of the form values
	const onFnameChange = (e) => {
		setFname(e.target.value);
	};
	const onLnameChange = (e) => {
		setLname(e.target.value);
	};
	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};

	// on submit event of the register form
	const onSubmit = (e) => {
		e.preventDefault();
		if (fname === "" || lname === "" || email === "" || password === "") {
			sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			axios
				.post("/lecturers/register", { fname, lname, email, password })
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						setFname("");
						setLname("");
						setEmail("");
						setPassword("");
						sendNotification({ text: msg, type: "success" });
					} else {
						sendNotification({ text: msg, type: "danger" });
					}
				})
				.catch((err) =>
					sendNotification({ text: err, type: "danger" })
				);
		}
	};

	return (
		<Fragment>
			<NavBar active='register' />
			<Container>
				<Row className='mb-5'>
					<Col sm='12' md={{ offset: 2, size: 8 }}>
						<Card className='mb-5'>
							<CardBody>
								<CardTitle className='text-center' tag='h5'>
									Lecturer's Registration Form
								</CardTitle>
								<Form onSubmit={onSubmit}>
									<FormGroup>
										<Label for='fname'>First Name</Label>
										<Input
											type='text'
											name='fname'
											id='fname'
											placeholder='First Name'
											className='mb-3'
											onChange={onFnameChange}
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
											onChange={onLnameChange}
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
											onChange={onEmailChange}
											required
										/>
									</FormGroup>
									<FormGroup>
										<Label for='password'>Password</Label>
										<Input
											type='password'
											name='password'
											id='password'
											placeholder='Password'
											onChange={onPasswordChange}
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
		</Fragment>
	);
};

export default Register;
