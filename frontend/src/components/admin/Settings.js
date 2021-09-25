import React, { useState, Fragment } from "react";
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Card,
	CardBody,
	CardTitle,
	Row,
	Col,
	Container,
} from "reactstrap";
import classnames from "classnames";
import NavBar from "./NavBar";
import AdminCourses from "./course/Courses";
import AdminDepartments from "./department/Departments";
import AdminSessions from "./session/Sessions";
import { CourseProvider } from "./course/CourseContext";
import { DepartmentProvider } from "./department/DepartmentContext";
import { SessionProvider } from "./session/SessionContext";

const Settings = () => {
	const [activeTab, setActiveTab] = useState("1");

	const toggle = (tab) => {
		if (activeTab !== tab) setActiveTab(tab);
	};

	return (
		<Fragment>
			<NavBar active='settings' />
			<Container>
				<Row className='mb-5'>
					<Col sm='12' lg={{ offset: 1, size: 10 }}>
						<h4 className='text-center mb-3'>ADMINISTRATOR</h4>
						<Card className='mb-5'>
							<CardBody>
								<CardTitle
									className={classnames("text-center")}
									tag='h3'>
									Settings
								</CardTitle>
								<Nav tabs>
									<NavItem>
										<NavLink
											style={{ cursor: "pointer" }}
											className={classnames({
												active: activeTab === "1",
											})}
											onClick={() => {
												toggle("1");
											}}>
											Courses
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											style={{ cursor: "pointer" }}
											className={classnames({
												active: activeTab === "2",
											})}
											onClick={() => {
												toggle("2");
											}}>
											Departments
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											style={{ cursor: "pointer" }}
											className={classnames({
												active: activeTab === "3",
											})}
											onClick={() => {
												toggle("3");
											}}>
											Sessions
										</NavLink>
									</NavItem>
								</Nav>
								<TabContent activeTab={activeTab}>
									<TabPane tabId='1'>
										<Row>
											<Col sm='12'>
												<CourseProvider>
													<AdminCourses />
												</CourseProvider>
											</Col>
										</Row>
									</TabPane>
									<TabPane tabId='2'>
										<Row>
											<Col sm='12'>
												<DepartmentProvider>
													<AdminDepartments />
												</DepartmentProvider>
											</Col>
										</Row>
									</TabPane>
									<TabPane tabId='3'>
										<Row>
											<Col sm='12'>
												<SessionProvider>
													<AdminSessions />
												</SessionProvider>
											</Col>
										</Row>
									</TabPane>
								</TabContent>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Settings;
