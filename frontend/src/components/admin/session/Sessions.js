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
import AddSessionModal from "./AddSessionModal";
import { SessionContext } from "./SessionContext";
import Cookies from "js-cookie";

// sessions to loop through and display on the table
const SingleSession = ({ cnt, session, createdAt, id, deleteSession }) => (
	<tr>
		<td>{cnt}</td>
		<td>{session}</td>
		<td>{moment(createdAt).format("MMMM Do, YYYY")}</td>
		<td>
			<span
				className='btn btn-sm btn-danger'
				onClick={() => {
					deleteSession(id);
				}}>
				<i className='fa fa-times' aria-hidden='true'></i>
			</span>
		</td>
	</tr>
);

// the main functional component
const Sessions = () => {
	const [sessions, setSessions] = useContext(SessionContext);

	// display notification messages
	const sendNotification = ({ text, type }) => {
		notify({ text, variant: type });
	};

	// delete a session
	const deleteSession = (id) => {
		const token = Cookies.get("admin_access_token");
		axios
			.delete(`/admin/sessions/delete/${id}`, {
				headers: { "x-auth-token": token },
			})
			.then((res) => {
				let { isCompleted, msg } = res.data;
				if (isCompleted) {
					sendNotification({ text: msg, type: "success" });
					setSessions(
						sessions.filter((session) => session._id !== id)
					);
				} else {
					sendNotification({ text: msg, type: "danger" });
				}
			})
			.catch((err) => console.log(err));
	};

	// set the sessions to the body of the table
	const allSessions = () => {
		return React.Children.toArray(
			sessions &&
				sessions.map((session, index) => {
					return (
						<SingleSession
							id={session._id}
							session={session.session}
							createdAt={session.createdAt}
							deleteSession={deleteSession}
							key={session._id}
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
									Available Sessions
									<AddSessionModal />
								</CardTitle>
								{(sessions && sessions.length === 0) ||
								sessions === null ? (
									<h4 className='text-center text-danger mt-4'>
										No Sessions Added!
									</h4>
								) : (
									<Table responsive hover className='mt-4'>
										<thead>
											<tr>
												<th>#</th>
												<th>Session</th>
												<th>Date Added</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{allSessions()}</tbody>
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

export default Sessions;
