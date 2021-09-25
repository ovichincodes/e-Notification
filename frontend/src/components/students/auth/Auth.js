import Cookies from "js-cookie";

class Auth {
	// login the student
	login(std_access_token, cb) {
		Cookies.set("std_access_token", std_access_token);
		this.authenticated = true;
		cb();
	}
	// logout the student
	logout(cb) {
		Cookies.remove("std_access_token");
		this.authenticated = false;
		cb();
	}
	// return the status of a student
	isAuthenticated() {
		return Cookies.get("std_access_token") === undefined ||
			Cookies.get("std_access_token") === null
			? false
			: true;
	}
}
// export an instance of the class
export default new Auth();
