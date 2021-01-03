import React, { Component } from "react";
import UsersStore from "../../store/users";
import { observer } from "mobx-react";
import "./auth.scss";

import { Link } from "react-router-dom";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "none",
			message: "",
			username: "",
			password: "",
		};
	}

	submit = async (e) => {
		e.preventDefault();
		this.setState({ message: "" });
		const { username, password } = this.state;

		try {
			await UsersStore.login({ username, password });
		} catch (error) {
			this.setState({ message: error.message });
		}
	};

	render() {
		const disable = false; // this.status === "pending";
		// const status=UserStore.getState();
		if (UsersStore.getState() !== "authorized") {
			return (
				<form className="authorize-form">
					<h2>Authenticate access</h2>
					{Boolean(this.state.message) && <div>{this.state.message}</div>}
					<div>
						<label htmlFor="username">Username:</label>
						<input
							id="username"
							type="text"
							disabled={disable}
							autoFocus
							value={this.state.username}
							onChange={(e) => {
								this.setState({ username: e.target.value });
							}}
						/>
					</div>
					<div>
						<label htmlFor="password">Password:</label>
						<input
							id="password"
							type="password"
							disabled={disable}
							value={this.state.password}
							onChange={(e) => {
								this.setState({ password: e.target.value });
							}}
						/>
					</div>
					<button type="submit" onClick={this.submit}>
						Login
					</button>
				</form>
			);
		} else {
			return (
				<div className="authorize-form">
					<h1>You are authorized as</h1>
					<h2>{UsersStore.getCurrentUser().profile.data.email}</h2>
					<Link to="/">
						&lt;&lt;&lt; Back to main page and manage page content
					</Link>
				</div>
			);
		}
	}
}

export default observer(Login);
