import "../../scss/login.scss";

import React, { Component } from "react";
import UsersStore from "../../store/users";
import { observer } from "mobx-react";

import ContentLoader from "../layout/ContentLoader";
import { Input } from "../general/Window";

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
				<div className="header">
					<h1>Access authorization</h1>
				</div>
				<div className="content">
					<Input
						label="Username"
						name="username"
						type="text"
						disabled={disable}
						autoFocus
						value={this.state.username}
						onChange={(e) => {
							this.setState({ username: e.target.value });
						}}
					/>
					<Input
						label="Password"
						name="password"
						type="password"
						disabled={disable}
						value={this.state.password}
						onChange={(e) => {
							this.setState({ password: e.target.value });
						}}
					/>
				</div>
				<div className="footer">
					<ContentLoader busy={disable}>
						<button disabled={disable} type="submit" onClick={this.submit}>
							<IconLogin size="20px" />
							<span>Login</span>
						</button>
					</ContentLoader>
				</div>
				{Boolean(this.state.user) && <Redirect to="/admin/dashboard" />}
			</form>
		);
	}
}

export default observer(Login);
