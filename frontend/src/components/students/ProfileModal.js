import React, { Component, Fragment } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import Notification, { notify } from "react-notify-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import "./style.css";

class ProfileModal extends Component {
	state = {
		modal: false,
		email: "",
		phone: "",
		level: "",
	};

	// toggle the opening and closing of the modal
	toggle = () => {
		this.setState({ modal: !this.state.modal });
	};

	// display messages
	sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// set the state on change of the form values
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	// on submit event of the login form
	onSubmit = (e) => {
		e.preventDefault();
		let { email, phone, level } = this.state;
		if (email === "" || phone === "" || level === "") {
			this.sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			let token = Cookies.get("std_access_token");
			axios
				.post(
					"/students/profile",
					{ email, phone, level },
					{ headers: { "x-auth-token": token } }
				)
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						this.sendNotification({ text: msg, type: "success" });
						this.toggle();
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
		let token = Cookies.get("std_access_token");
		axios
			.get("/students/student", { headers: { "x-auth-token": token } })
			.then((res) => {
				let { email, phone, level } = res.data;
				this.setState({ email, phone, level });
			})
			.catch((err) =>
				this.sendNotification({ text: err, type: "danger" })
			);
	}

	render() {
		return (
			<Fragment>
				{/* navlink item to add the admin link to the nav */}
				<Link to='#' className='nav_bar' onClick={this.toggle}>
					Profile
				</Link>

				{/* admin login modal */}
				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>
						Update Profile
					</ModalHeader>
					<ModalBody>
						<Form onSubmit={this.onSubmit}>
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
									required
								/>
							</FormGroup>
							<FormGroup>
								<Label for='phone'>Phone Number</Label>
								<Input
									type='tel'
									name='phone'
									id='phone'
									placeholder='Phone Number'
									className='mb-3'
									value={this.state.phone}
									onChange={this.onChange}
									required
								/>
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
									<option value=''>Choose...</option>
									<option
										defaultValue={
											this.state.level === 1 ? true : ""
										}
										value='1'>
										100
									</option>
									<option
										defaultValue={
											this.state.level === 2 ? true : ""
										}
										value='2'>
										200
									</option>
									<option
										defaultValue={
											this.state.level === 3 ? true : ""
										}
										value='3'>
										300
									</option>
									<option
										defaultValue={
											this.state.level === 4 ? true : ""
										}
										value='4'>
										400
									</option>
									<option
										defaultValue={
											this.state.level === 5 ? true : ""
										}
										value='5'>
										500
									</option>
									<option
										defaultValue={
											this.state.level === 6 ? true : ""
										}
										value='6'>
										600
									</option>
								</Input>
							</FormGroup>
							<Button
								type='submit'
								color='success'
								style={{ marginTop: "2rem" }}
								block>
								Update
							</Button>
						</Form>
					</ModalBody>
				</Modal>
				<Notification />
			</Fragment>
		);
	}
}

export default ProfileModal;
