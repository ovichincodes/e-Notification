import Cookies from "js-cookie";

class Auth {
	// login the admin
	login(admin_access_token, cb) {
		Cookies.set("admin_access_token", admin_access_token);
		this.authenticated = true;
		cb();
	}
	// logout the admin
	logout(cb) {
		Cookies.remove("admin_access_token");
		this.authenticated = false;
		cb();
	}
	// return the status of a admin
	isAuthenticated() {
		return Cookies.get("admin_access_token") === undefined ? false : true;
	}
}
// export an instance of the class
export default new Auth();
