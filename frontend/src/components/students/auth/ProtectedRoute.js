import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./Auth";

export const StudentProtected = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				return auth.isAuthenticated() ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/",
							state: {
								from: props.location,
							},
						}}
					/>
				);
			}}
		/>
	);
};

export const StudentUnprotected = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				return auth.isAuthenticated() ? (
					<Redirect
						to={{
							pathname: "/results",
						}}
					/>
				) : (
					<Component {...props} />
				);
			}}
		/>
	);
};
