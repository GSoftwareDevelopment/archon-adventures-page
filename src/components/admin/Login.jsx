import React, { Component } from "react";
import UsersStore, { state } from "../../store/users";
import { observer } from "mobx-react";
import "./scss/login.scss";

import { Link } from "react-router-dom";
import ContentLoader from "../layout/ContentLoader";

import { BoxArrowLeft as IconLogout } from "react-bootstrap-icons";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "done",
			message: "",
			username: "",
			password: "",
		};
	}

	submit = async (e) => {
		e.preventDefault();
		this.setState({ status: "logging", message: "" });
		const { username, password } = this.state;

		try {
			await UsersStore.login({ username, password });
			this.setState({ status: "done" });
		} catch (error) {
			this.setState({ status: "error", message: error.message });
		}
	};

	async logout() {
		await UsersStore.logout();
	}

	render() {
		const status = this.state.status;
		const disable = status !== "done";

		if (UsersStore.getState() !== state.authorized) {
			return (
				<form className="authorize-form">
					<h1>Authenticate access</h1>
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
					<ContentLoader busy={disable}>
						<button disabled={disable} type="submit" onClick={this.submit}>
							Login
						</button>
					</ContentLoader>
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
					<button
						onClick={() => {
							this.logout();
						}}
					>
						<IconLogout size="20px" /> Logout
					</button>
				</div>
			);
		}
	}
}

export default observer(Login);
