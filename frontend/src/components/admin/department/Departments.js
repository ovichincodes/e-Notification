import React, { useContext } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	CardBody,
	CardTitle,
	Table,
} from "reactstrap";
import axios from "axios";
import moment from "moment";
import Notification, { notify } from "react-notify-bootstrap";
import AddDepartmentModal from "./AddDepartmentModal";
import { DepartmentContext } from "./DepartmentContext";
import Cookies from "js-cookie";

// departments to loop through and display on the table
const SingleDepartment = ({ cnt, name, createdAt, id, deleteDepartment }) => (
	<tr>
		<td>{cnt}</td>
		<td>{name}</td>
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td>
			<span
				className='btn btn-sm btn-danger'
				onClick={() => {
					deleteDepartment(id);
				}}>
				<i className='fa fa-times' aria-hidden='true'></i>
			</span>
		</td>
	</tr>
);

// the main functional component
const Departments = () => {
	const [departments, setDepartments] = useContext(DepartmentContext);

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// delete a department
	const deleteDepartment = (id) => {
		const token = Cookies.get("admin_access_token");
		axios
			.delete(`/admin/departments/delete/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setDepartments(
						departments.filter(
							(department) => department._id !== id
						)
					);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	};

	// set the departments to the body of the table
	const allDepartments = () => {
		return React.Children.toArray(
			departments &&
				departments.map((department, index) => {
					return (
						<SingleDepartment
							id={department._id}
							name={department.name}
							createdAt={department.createdAt}
							deleteDepartment={deleteDepartment}
							key={department._id}
							cnt={index + 1}
						/>
					);
				})
		);
	};

	return (
		<React.Fragment>
			<Container>
				<Row className='mb-1'>
					<Col sm='12' lg={{ offset: 1, size: 10 }}>
						<Card className='my-5'>
							<CardBody>
								<CardTitle tag='h5'>
									Available Departments
									<AddDepartmentModal />
								</CardTitle>
								{(departments && departments.length === 0) ||
								departments === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Departments Added!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>Name</th>
												<th>Date Added</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allDepartments()}</tbody>
									</Table>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			<Notification />
		</React.Fragment>
	);
};

export default Departments;
