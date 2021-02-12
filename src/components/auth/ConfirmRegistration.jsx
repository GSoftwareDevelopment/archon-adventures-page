import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ConfirmRegistration extends Component {
	render() {
		return (
			<form className="authorize-form">
				<h1>Account registration confirm</h1>
			</form>
		);
	}
}

export default withRouter(ConfirmRegistration);
