import Cookies from "js-cookie";

class Auth {
	// login the lecturer
	login(lecturer_access_token, cb) {
		Cookies.set("lecturer_access_token", lecturer_access_token);
		this.authenticated = true;
		cb();
	}
	// logout the lecturer
	logout(cb) {
		Cookies.remove("lecturer_access_token");
		this.authenticated = false;
		cb();
	}
	// return the status of a lecturer
	isAuthenticated() {
		return Cookies.get("lecturer_access_token") === undefined
			? false
			: true;
	}
}
// export an instance of the class
export default new Auth();
