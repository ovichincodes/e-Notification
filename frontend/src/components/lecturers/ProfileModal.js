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
		fname: "",
		lname: "",
		email: "",
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

	// on submit event of the profile update form
	onSubmit = (e) => {
		e.preventDefault();
		let { fname, lname, email } = this.state;
		if (fname === "" || lname === "" || email === "") {
			this.sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			let token = Cookies.get("lecturer_access_token");
			axios
				.post(
					"/lecturers/profile",
					{ fname, lname, email },
					{ headers: { "x-auth-token": token } }
				)
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						this.sendNotification({ text: msg, type: "success" });
						localStorage.setItem("lec_name", `${fname} ${lname}`);
						this.toggle();
						window.location.reload();
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
		let token = Cookies.get("lecturer_access_token");
		axios
			.get("/lecturers/lecturer", { headers: { "x-auth-token": token } })
			.then((res) => {
				let { fname, lname, email } = res.data;
				this.setState({ fname, lname, email });
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
								<Label for='fname'>First Name</Label>
								<Input
									type='fname'
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
								<Label for='lname'>Email</Label>
								<Input
									type='lname'
									name='lname'
									id='lname'
									placeholder='Email'
									className='mb-3'
									value={this.state.lname}
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
									required
								/>
							</FormGroup>
							<Button
								type='submit'
								color='dark'
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
