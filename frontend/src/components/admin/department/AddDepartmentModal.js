import React, { Fragment, useContext, useState } from "react";
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
import { DepartmentContext } from "./DepartmentContext";
import Cookies from "js-cookie";

const AddDepartmentModal = () => {
	const [modal, setModal] = useState(false);
	const [name, setName] = useState(""); //department name
	const [departments, setDepartments] = useContext(DepartmentContext);

	// toggle the opening and closing of the modal
	const toggle = () => {
		setModal(!modal);
	};

	// set the state on change of the form field
	const onChange = (e) => {
		setName(e.target.value);
	};

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the departments form
	const onSubmit = (e) => {
		e.preventDefault();
		// validate the form
		if (name === "") {
			sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			// add new department
			const token = Cookies.get("admin_access_token");
			axios
				.post(
					"/admin/departments/add",
					{ name },
					{
						headers: { "x-auth-token": token },
					}
				)
				.then((res) => {
					let { isCompleted, msg, lastDepartment } = res.data;
					if (isCompleted) {
						setName("");
						setDepartments(
							[...departments, lastDepartment].sort((a, b) =>
								a.name < b.name ? -1 : 1
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
				<ModalHeader toggle={toggle}>Add New Departments</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for='name'>
								<i className='fa fa-edit'></i> Department Name
							</Label>
							<Input
								type='text'
								name='name'
								id='name'
								placeholder='Name'
								className='mb-3'
								onChange={onChange}
								required
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

export default AddDepartmentModal;
