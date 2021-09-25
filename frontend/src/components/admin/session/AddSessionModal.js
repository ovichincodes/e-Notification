import React, { Fragment, useState, useContext } from "react";
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
import Notification, { notify } from "react-notify-bootstrap";
import axios from "axios";
import { SessionContext } from "./SessionContext";
import Cookies from "js-cookie";

const AddSessionModal = () => {
	const [modal, setModal] = useState(false);
	const [session, setSession] = useState("");
	const [sessions, setSessions] = useContext(SessionContext);

	// toggle the opening and closing of the modal
	const toggle = () => {
		setModal(!modal);
	};

	// set the state on change of the form values
	const onChange = (e) => {
		setSession(e.target.value);
	};

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the session form
	const onSubmit = (e) => {
		e.preventDefault();
		// validate the form
		if (session === "") {
			sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			// add new session
			const token = Cookies.get("admin_access_token");
			axios
				.post(
					"/admin/sessions/add",
					{ session },
					{
						headers: { "x-auth-token": token },
					}
				)
				.then((res) => {
					let { isCompleted, msg, lastSession } = res.data;
					if (isCompleted) {
						setSession("");
						setSessions(
							[...sessions, lastSession].sort((a, b) =>
								a.createdAt > b.createdAt ? -1 : 1
							)
						);
						toggle();
						sendNotification({ text: msg, type: "success" });
					} else {
						if (typeof msg === "object") {
							sendNotification({
								text: "Error occured!",
								type: "danger",
							});
						} else {
							sendNotification({ text: msg, type: "danger" });
						}
					}
				})
				.catch((err) => {
					sendNotification({ text: err, type: "danger" });
				});
		}
	};

	return (
		<Fragment>
			{/* upload button */}
			<Button
				onClick={toggle}
				style={{ float: "right" }}
				className='btn btn-sm'
				color='primary'>
				<i className='fa fa-plus-circle'></i> Add New
			</Button>

			{/* add modal */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Add New Sessions</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for='session'>
								<i className='fa fa-edit'></i> Session
							</Label>
							<Input
								type='text'
								name='session'
								id='session'
								placeholder='Session'
								className='mb-3'
								onChange={onChange}
							/>
						</FormGroup>
						<Button
							color='success'
							style={{ marginTop: "2rem" }}
							block
							type='submit'>
							<i className='fa fa-save'></i> Save
						</Button>
					</Form>
				</ModalBody>
			</Modal>
			<Notification />
		</Fragment>
	);
};

export default AddSessionModal;
