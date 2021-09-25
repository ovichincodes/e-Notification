import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AdminProtected } from "./components/admin/auth/ProtectedRoute";
import {
	LecturerProtected,
	LecturerUnprotected,
} from "./components/lecturers/auth/ProtectedRoute";
import {
	StudentProtected,
	StudentUnprotected,
} from "./components/students/auth/ProtectedRoute";
import AdminSettings from "./components/admin/Settings";
import AdminLecturers from "./components/admin/Lecturers";
import AdminStudents from "./components/admin/Students";
import LecturerLoginForm from "./components/lecturers/LoginForm";
import LecturerResults from "./components/lecturers/results/UploadedResults";
import LecturerSingleResult from "./components/lecturers/results/SingleResult";
import StudentLoginForm from "./components/students/LoginForm";
import StudentResultForm from "./components/students/ResultsForm";
import LecturerRegisterForm from "./components/lecturers/Register";
import StudentRegisterForm from "./components/students/Register";
import Error404 from "./components/Error404";
import Footer from "./components/Footer";

function App() {
	return (
		<Router>
			<Switch>
				<AdminProtected
					path='/admin/lecturers'
					exact
					component={AdminLecturers}
				/>
				<AdminProtected
					path='/admin/students'
					exact
					component={AdminStudents}
				/>
				<AdminProtected
					path='/admin/settings'
					exact
					component={AdminSettings}
				/>
				<LecturerProtected
					path='/lecturer/results'
					exact
					component={LecturerResults}
				/>
				<LecturerProtected
					path='/lecturer/results/:id/:course'
					exact
					component={LecturerSingleResult}
				/>
				<LecturerUnprotected
					path='/lecturer'
					exact
					component={LecturerLoginForm}
				/>
				<LecturerUnprotected
					path='/lecturer/register'
					exact
					component={LecturerRegisterForm}
				/>
				<StudentProtected
					path='/results'
					exact
					component={StudentResultForm}
				/>
				<StudentUnprotected
					path='/'
					exact
					component={StudentLoginForm}
				/>
				<StudentUnprotected
					path='/register'
					exact
					component={StudentRegisterForm}
				/>
				<Route path='*' component={Error404} />
			</Switch>
			<Footer />
		</Router>
	);
}

export default App;
