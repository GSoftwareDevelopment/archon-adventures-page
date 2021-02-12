import "../../scss/login.scss";

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

import ContentLoader from "../layout/ContentLoader";
import { getProviderClient } from "../../libs/db";
import { toast } from "react-toastify";

class ResetPassword extends Component {
	state = {
		username: "",
		password: "",
		status: "nothing",
		redirect: false,
	};

	componentDidMount() {
		const { token, tokenId } = this.getTokens();
		if (!token || !tokenId) this.setState({ redirect: true });
		console.log(token, tokenId);
	}

	getTokens() {
		const query = new URLSearchParams(this.props.location.search);
		return { token: query.get("token"), tokenId: query.get("tokenId") };
	}

	submit = async (e) => {
		e.preventDefault();
		this.setState({ status: "pending" });

		const { token, tokenId } = this.getTokens();
		try {
			await getProviderClient().resetPassword(
				token,
				tokenId,
				this.state.password
			);
			toast.error("Your password was changed.");
			this.setState({ redirect: true });
		} catch (error) {
			console.log(error);
			toast.error(error.message);
			this.setState({ status: "done" });
		}
	};

	render() {
		const disable = this.state.status === "pending";

		return (
			<form className="authorize-form" autoComplete="off">
				<h1>Password reset request</h1>

				<div>
					<label htmlFor="new-password">Password:</label>
					<input
						id="new-password"
						type="password"
						autoComplete="new-password"
						disabled={disable}
						value={this.state.password}
						onChange={(e) => {
							this.setState({ password: e.target.value });
						}}
					/>
				</div>
				<ContentLoader busy={disable}>
					<button disabled={disable} type="submit" onClick={this.submit}>
						<span>Save</span>
					</button>
				</ContentLoader>
				{Boolean(this.state.redirect) && <Redirect to="/auth/login" />}
			</form>
		);
	}
}

export default withRouter(ResetPassword);
