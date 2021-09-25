import React, { Component, Fragment } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	Container,
} from "reactstrap";
import { Link } from "react-router-dom";
import auth from "./auth/Auth";
import "./style.css";

class NavBar extends Component {
	// state must not be put in side of a constructor
	state = {
		isOpen: false,
	};

	// toggle the collapse on smaller screen
	toggle = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	// color the active nav white
	// active = {
	// 	color: this.props.active === ""
	// }

	render() {
		return (
			<Fragment>
				<Navbar color='dark' dark expand='sm' className='mb-5'>
					<Container>
						<NavbarBrand href='/'>
							<i className='fa fa-bell' aria-hidden='true'></i>{" "}
							Result Notification
						</NavbarBrand>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className='ml-auto' navbar>
								{auth.isAuthenticated() ? (
									<Fragment>
										<NavItem>
											<Link
												className='nav_bar'
												style={{
													color:
														this.props.active ===
														"lecturer"
															? "white"
															: "",
												}}
												to='/admin/lecturers'>
												Lecturers
											</Link>
										</NavItem>
										<NavItem>
											<Link
												className='nav_bar'
												style={{
													color:
														this.props.active ===
														"student"
															? "white"
															: "",
												}}
												to='/admin/students'>
												Students
											</Link>
										</NavItem>
										<NavItem>
											<Link
												className='nav_bar'
												style={{
													color:
														this.props.active ===
														"settings"
															? "white"
															: "",
												}}
												to='/admin/settings'>
												Settings
											</Link>
										</NavItem>
										<NavItem>
											<Link
												className='nav_bar'
												to='#'
												onClick={() => {
													auth.logout(() => {
														window.location.assign(
															"/lecturer"
														);
													});
												}}>
												Logout
											</Link>
										</NavItem>
									</Fragment>
								) : (
									<NavItem>
										<Link
											className='nav_bar'
											to='/lecturer'>
											Login
										</Link>
									</NavItem>
								)}
							</Nav>
						</Collapse>
					</Container>
				</Navbar>
			</Fragment>
		);
	}
}

export default NavBar;
