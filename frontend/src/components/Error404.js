import React, { useState } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	// NavLink,
	Container,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

const Error404 = () => {
	const [isOpen, setIsOpen] = useState(false);

	// toggle the collapse on smaller screen
	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<React.Fragment>
			<Navbar color='dark' dark expand='sm' className='mb-5'>
				<Container>
					<NavbarBrand href='/'>
						<i className='fa fa-bell' aria-hidden='true'></i> Result
						Notification
					</NavbarBrand>
					<NavbarToggler onClick={toggle} />
					<Collapse isOpen={isOpen} navbar>
						<Nav className='ml-auto' navbar>
							<NavItem>
								{/* <NavLink href='/admin/lecturers'>
									Lecturers
								</NavLink> */}
							</NavItem>
						</Nav>
					</Collapse>
				</Container>
			</Navbar>
			<h3 className='text-center text-danger'>Page Not Found!</h3>
			<p className={classnames("text-center")}>
				<Link className={classnames("btn btn-sm btn-success")} to='/'>
					Go Home
				</Link>
			</p>
		</React.Fragment>
	);
};

export default Error404;
