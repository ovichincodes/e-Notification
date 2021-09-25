import React from "react";

const style = {
	backgroundColor: "#343a40",
	borderTop: "1px solid #E7E7E7",
	textAlign: "center",
	padding: "20px",
	position: "fixed",
	left: "0",
	bottom: "0",
	height: "60px",
	width: "100%",
	color: "#fff",
};

const Footer = () => {
	return (
		<React.Fragment>
			<div style={style}>
				&copy; Result Notification System, {new Date().getFullYear()}.
			</div>
		</React.Fragment>
	);
};

export default Footer;
