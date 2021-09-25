import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./Auth";

export const AdminProtected = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (auth.isAuthenticated()) {
					return <Component {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: "/lecturer",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				}
			}}
		/>
	);
};

export const AdminUnprotected = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (auth.isAuthenticated()) {
					return (
						<Redirect
							to={{
								pathname: "/admin/lecturers",
							}}
						/>
					);
				} else {
					return <Component {...props} />;
				}
			}}
		/>
	);
};
