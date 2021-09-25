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
import ProfileModal from "./ProfileModal";
import "./style.css";
import AdminModal from "../admin/AdminModal";
import auth from "./auth/Auth";

class NavBar extends Component {
	// state must not be put in side of a constructor
	state = {
		isOpen: false,
	};

	// toggle the collapse on smaller screen
	toggle = () => this.setState({ isOpen: !this.state.isOpen });

	// lecturer logout
	logout = () => {
		auth.logout(() => {
			localStorage.removeItem("lec_name");
			window.location.assign("/lecturer");
		});
	};

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
														"result"
															? "white"
															: "",
												}}
												to='/lecturer/results'>
												Results
											</Link>
										</NavItem>
										<NavItem>
											<ProfileModal />
										</NavItem>
										<NavItem>
											<Link
												className='nav_bar'
												to='#'
												onClick={this.logout}>
												Logout
											</Link>
										</NavItem>
									</Fragment>
								) : (
									<Fragment>
										<NavItem>
											<Link
												className='nav_bar'
												style={{
													color:
														this.props.active ===
														"login"
															? "white"
															: "",
												}}
												to='/lecturer'>
												Login
											</Link>
										</NavItem>
										<NavItem>
											<Link
												className='nav_bar'
												style={{
													color:
														this.props.active ===
														"register"
															? "white"
															: "",
												}}
												to='/lecturer/register'>
												Register
											</Link>
										</NavItem>
										<NavItem>
											<AdminModal />
										</NavItem>
									</Fragment>
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
