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
import "./style.css";
import ProfileModal from "./ProfileModal";
import auth from "./auth/Auth";

class NavBar extends Component {
	// state must not be put in side of a constructor
	state = {
		isOpen: false,
	};

	// toggle the collapse on smaller screen
	toggle = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	// student logout
	logout = () => {
		auth.logout(() => {
			localStorage.removeItem("std_name");
			window.location.assign("/");
		});
	};

	render() {
		return (
			<Fragment>
				<Navbar color='dark' dark expand='sm' className='mb-5'>
					<Container>
						<NavbarBrand href='/'>Result Notification</NavbarBrand>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className='ml-auto' navbar>
								{auth.isAuthenticated() ? (
									<Fragment>
										<NavItem>
											<Link
												to='/results'
												style={{
													color:
														this.props.active ===
														"result"
															? "white"
															: "",
												}}
												className='nav_bar'>
												Results
											</Link>
										</NavItem>
										<NavItem>
											<ProfileModal />
										</NavItem>
										<NavItem>
											<Link
												to='#'
												onClick={this.logout}
												className='nav_bar'>
												Logout
											</Link>
										</NavItem>
									</Fragment>
								) : (
									<Fragment>
										<NavItem>
											<Link
												to='/'
												className='nav_bar'
												style={{
													color:
														this.props.active ===
														"login"
															? "white"
															: "",
												}}>
												Login
											</Link>
										</NavItem>
										<NavItem>
											<Link
												to='/register'
												style={{
													color:
														this.props.active ===
														"register"
															? "white"
															: "",
												}}
												className='nav_bar'>
												Register
											</Link>
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
