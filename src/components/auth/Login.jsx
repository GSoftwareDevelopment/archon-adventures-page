import "../../scss/login.scss";

import React, { Component } from "react";
import UsersStore from "../../store/users";
import { observer } from "mobx-react";

import ContentLoader from "../layout/ContentLoader";

import { BoxArrowInRight as IconLogin } from "react-bootstrap-icons";
import { Redirect } from "react-router-dom";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			user: undefined,
		};
	}

	submit = async (e) => {
		e.preventDefault();
		const { username, password } = this.state;

		const user = await UsersStore.login({ username, password }, true);
		this.setState({ user });
	};

	render() {
		const status = UsersStore.getStatus();
		const disable = status !== "done" && status !== "warn";

		return (
			<form className="authorize-form">
				<h1>Authenticate access</h1>
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
						<IconLogin size="20px" />
						<span>Login</span>
					</button>
				</ContentLoader>
				{Boolean(this.state.user) && <Redirect to="/admin/dashboard" />}
			</form>
		);
	}
}

export default observer(Login);
