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
import { CourseContext } from "./CourseContext";
import Cookies from "js-cookie";

const AddCourseModal = () => {
	const [modal, setModal] = useState(false);
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [courses, setCourses] = useContext(CourseContext);

	// toggle the opening and closing of the modal
	const toggle = () => {
		setModal(!modal);
	};

	// set the state on change of the title field
	const onTitleChange = (e) => {
		setTitle(e.target.value);
	};

	// set the state on change of the code field
	const onCodeChange = (e) => {
		setCode(e.target.value);
	};

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the courses form
	const onSubmit = (e) => {
		e.preventDefault();
		// validate the form
		if (title === "" || code === "") {
			sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			// add new course
			const token = Cookies.get("admin_access_token");
			axios
				.post(
					"/admin/courses/add",
					{ title, code },
					{ headers: { "x-auth-token": token } }
				)
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						let { lastCourse } = res.data;
						setTitle("");
						setCode("");
						setCourses(
							[...courses, lastCourse].sort((a, b) =>
								a.title > b.title ? -1 : 1
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
				<ModalHeader toggle={toggle}>Add New Courses</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for='title'>
								<i className='fa fa-edit'></i> Course Title
							</Label>
							<Input
								type='text'
								name='title'
								id='title'
								placeholder='Title'
								className='mb-3'
								onChange={onTitleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for='code'>
								<i className='fa fa-edit'></i> Course Code
							</Label>
							<Input
								type='text'
								name='code'
								id='code'
								placeholder='Code'
								className='mb-3'
								onChange={onCodeChange}
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

export default AddCourseModal;
