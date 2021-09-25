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
	NavLink,
} from "reactstrap";
import axios from "axios";
import Notification, { notify } from "react-notify-bootstrap";
import auth from "./auth/Auth";

class AdminModal extends Component {
	state = {
		modal: false,
		username: "",
		password: "",
	};

	// toggle the opening and closing of the modal
	toggle = () => {
		this.setState({ modal: !this.state.modal });
	};

	// set the state on change of the form values
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	// display notification messages
	sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the login form
	onSubmit = (e) => {
		e.preventDefault();
		let { username, password } = this.state;
		if (username === "" || password === "") {
			this.sendNotification({
				text: "All Fields are required!",
				type: "danger",
			});
		} else {
			axios
				.post("/admin/login", {
					username,
					password,
				})
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						let { token } = res.data;
						this.setState({ username: "" });
						this.setState({ password: "" });
						this.sendNotification({ text: msg, type: "success" });
						this.toggle();
						auth.login(token, () => {
							window.location.assign("/admin/lecturers");
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
				{/* navlink item to add the admin link to the nav */}
				<NavLink href='#' onClick={this.toggle}>
					ADMIN
				</NavLink>

				{/* admin login modal */}
				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Admin Login</ModalHeader>
					<ModalBody>
						<Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Label for='username'>Username</Label>
								<Input
									type='text'
									name='username'
									id='username'
									placeholder='Username'
									className='mb-3'
									value={this.state.username}
									onChange={this.onChange}
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
									value={this.state.password}
									onChange={this.onChange}
									required
								/>
							</FormGroup>
							<Button
								type='submit'
								color='dark'
								style={{ marginTop: "2rem" }}
								block>
								Login
							</Button>
						</Form>
					</ModalBody>
				</Modal>
				<Notification />
			</Fragment>
		);
	}
}

export default AdminModal;
