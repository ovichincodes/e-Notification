import React, { Fragment, useState, useEffect, useContext } from "react";
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
import axios from "axios";
import Cookies from "js-cookie";
import { UploadedResultsContext } from "./UploadedResultsContext";
import Notification, { notify } from "react-notify-bootstrap";

const NewUploadModal = () => {
	const [modal, setModal] = useState(false);
	const [session, setSession] = useState("");
	const [department, setDepartment] = useState("");
	const [level, setLevel] = useState("");
	const [semester, setSemester] = useState("");
	const [course, setCourse] = useState("");
	const [resultFile, setResultFile] = useState(null);
	// these are set because we want to use the to loop
	// and show the courses departments and sessions in the select
	const [courses, setCourses] = useState(null);
	const [departments, setDepartments] = useState(null);
	const [sessions, setSessions] = useState(null);

	const [uploadedResults, setUploadedResults] = useContext(
		UploadedResultsContext
	);

	// toggle the opening and closing of the modal
	const toggle = () => {
		setModal(!modal);
	};

	// set session state
	const onSessionChange = (e) => {
		setSession(e.target.value);
	};

	// set department state
	const onDepartmentChange = (e) => {
		setDepartment(e.target.value);
	};

	// set level state
	const onLevelChange = (e) => {
		setLevel(e.target.value);
	};

	// set semester state
	const onSemesterChange = (e) => {
		setSemester(e.target.value);
	};

	// set course state
	const onCourseChange = (e) => {
		setCourse(e.target.value);
	};

	// set the state of the file on change(select)
	const onResultFileChange = (e) => {
		setResultFile(e.target.files[0]);
	};

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// on submit event of the login form
	const onSubmit = (e) => {
		e.preventDefault();
		// validate the form
		if (
			course === "" ||
			department === "" ||
			level === "" ||
			semester === "" ||
			session === ""
		) {
			sendNotification({
				text: "All Fields are Required!",
				type: "danger",
			});
		} else {
			// check if uploaded file is excel file
			const file = resultFile;
			// allowed Extensions
			const fileTypes = /xls|xlsb|xlsm|xlsx|xlt/;
			// check extension
			const extname = fileTypes.test(
				file.name.toLowerCase().split(".")[1]
			);
			// check if extname is true
			if (!extname) {
				sendNotification({
					text: "Only Excel files are allowed!",
					type: "danger",
				});
			} else {
				const data = new FormData();
				data.append("file", resultFile);
				data.append("course", course);
				data.append("department", department);
				data.append("level", level);
				data.append("semester", semester);
				data.append("session", session);
				let token = Cookies.get("lecturer_access_token");
				axios
					.post("/lecturers/upload", data, {
						headers: { "x-auth-token": token },
					})
					.then((res) => {
						let { isCompleted, msg, lastUploaded } = res.data;
						if (isCompleted) {
							setCourse("");
							setDepartment("");
							setLevel("");
							setSemester("");
							setSession("");
							setResultFile(null);
							setUploadedResults(
								[
									...uploadedResults,
									lastUploaded,
								].sort((a, b) => (a.level < b.level ? -1 : 1))
							);
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
		}
	};

	// fetch courses, departments and session
	useEffect(() => {
		let token = Cookies.get("lecturer_access_token");
		axios
			.get("/lecturers/getFormDetails", {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					let [courses, departments, sessions] = msg;
					setCourses(courses);
					setDepartments(departments);
					setSessions(sessions);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => sendNotification({ text: err, type: "danger" }));
	}, []);

	return (
		<Fragment>
			{/* upload button */}
			<Button
				onClick={toggle}
				style={{ float: "right" }}
				className='btn btn-sm'
				color='primary'>
				Upload New
			</Button>

			{/* upload modal */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Upload New Results</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for='session'>Session</Label>
							<Input
								type='select'
								name='session'
								id='session'
								value={session}
								onChange={onSessionChange}
								required>
								<option value=''>Choose...</option>
								{sessions &&
									sessions.map((session) => {
										return React.Children.toArray(
											<option value={session._id}>
												{session.session}
											</option>
										);
									})}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label for='department'>Department</Label>
							<Input
								type='select'
								name='department'
								id='department'
								value={department}
								onChange={onDepartmentChange}
								required>
								<option value=''>Choose...</option>
								{departments &&
									departments.map((department) => {
										return React.Children.toArray(
											<option value={department._id}>
												{department.name}
											</option>
										);
									})}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label for='level'>Level</Label>
							<Input
								type='select'
								name='level'
								id='level'
								value={level}
								onChange={onLevelChange}
								required>
								<option value=''>Choose...</option>
								<option value='1'>100</option>
								<option value='2'>200</option>
								<option value='3'>300</option>
								<option value='4'>400</option>
								<option value='5'>500</option>
								<option value='6'>600</option>
							</Input>
						</FormGroup>
						<FormGroup>
							<Label for='Semester'>Semester</Label>
							<Input
								type='select'
								name='semester'
								id='semester'
								value={semester}
								onChange={onSemesterChange}
								required>
								<option value=''>Choose...</option>
								<option value='1'>First</option>
								<option value='2'>Second</option>
							</Input>
						</FormGroup>
						<FormGroup>
							<Label for='course'>Course</Label>
							<Input
								type='select'
								name='course'
								id='course'
								value={course}
								onChange={onCourseChange}
								required>
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
						<FormGroup>
							<Label for='resultFile'>Result File</Label>
							<Input
								className='form-control'
								type='file'
								name='resultFile'
								id='resultFile'
								onChange={onResultFileChange}
								accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
								required></Input>
						</FormGroup>
						<Button
							color='dark'
							style={{ marginTop: "2rem" }}
							block
							type='submit'>
							Upload
						</Button>
					</Form>
				</ModalBody>
			</Modal>
			<Notification />
		</Fragment>
	);
};

export default NewUploadModal;
