import React, { Component } from "react";
import { Link } from "react-router-dom";
import { client, authorizeDB } from "../../libs/db";
import "./auth.scss";

import * as Icon from "react-bootstrap-icons";

export default class Login extends Component {
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
		this.setState({ status: "pending", message: "" });

		try {
			await authorizeDB(this.state);
			this.setState({ status: "authorized" });
			this.props.onAuthorized("authorized");
			// return <Redirect to="/" />;
		} catch (error) {
			console.error(error);
			this.setState({ status: "error", message: error.message });
		}
	};

	render() {
		const disable = this.status === "pending";

		if (this.state.status !== "authorized") {
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
					<button type="submit" disabled={disable} onClick={this.submit}>
						{this.state.status !== "pending" ? "Authorize" : "Authorizing..."}
					</button>
				</form>
			);
		} else {
			return (
				<div className="authorize-form">
					<h1>You are authorized now.</h1>
					<Link to="/">
						&lt;&lt;&lt; Back to main page and manage page content
					</Link>
				</div>
			);
		}
	}
}

export class Userinfo extends Component {
	constructor() {
		super();

		this.state = { status: "" };
	}

	logout = async () => {
		this.setState({ status: "pending" });
		try {
			await client.auth.logout();
			this.setState({ status: "anonymous" });
			this.props.onChange("anonymous");
		} catch (error) {
			console.log(error);
			this.setState({ status: "error" });
		}
	};

	render() {
		const currentUser = client.auth.currentUser;
		if (currentUser && currentUser.loggedInProviderType === "local-userpass") {
			return (
				<div className="auth-status">
					<div className="user">
						<div>{currentUser.profile.data.email}</div>
						<button onClick={this.logout}>
							<Icon.BoxArrowLeft size="20px" />
						</button>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
