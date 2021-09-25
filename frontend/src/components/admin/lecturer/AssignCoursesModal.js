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
import { CourseContext } from "../course/CourseContext";
import Cookies from "js-cookie";

const AssignCoursesModal = ({ LecturerId }) => {
	const [modal, setModal] = useState(false);
	const [course, setCourse] = useState("");
	const [courses] = useContext(CourseContext);

	// toggle the opening and closing of the modal
	const toggle = () => {
		setModal(!modal);
	};

	// set the state on change of the form field
	const onChange = (e) => {
		setCourse(e.target.value);
	};

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the course assignment form
	const onSubmit = (e) => {
		e.preventDefault();
		if (course === "") {
			sendNotification({
				text: "Select a course from this list!",
				type: "danger",
			});
		} else {
			const token = Cookies.get("admin_access_token");
			axios
				.post(
					"/admin/lecturers/course/assign",
					{
						courseId: course,
						LecturerId,
					},
					{
						headers: { "x-auth-token": token },
					}
				)
				.then((res) => {
					let { isCompleted, msg } = res.data;
					if (isCompleted) {
						toggle();
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
			{/* assign button */}
			<span className='btn btn-sm btn-info mr-2' onClick={toggle}>
				<i className='fa fa-pencil' aria-hidden='true'></i>
			</span>

			{/* assign course modal */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					Assign Course to Lecturer
				</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for='course'>
								<i className='fa fa-edit'></i> Select a Course
							</Label>
							<Input
								type='select'
								name='course'
								id='course'
								value={course}
								onChange={onChange}>
								<option value=''>Choose...</option>
								{courses &&
									courses.map((course) => {
										return React.Children.toArray(
											<option value={course._id}>
												{course.title}
											</option>
										);
									})}
							</Input>
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

export default AssignCoursesModal;
