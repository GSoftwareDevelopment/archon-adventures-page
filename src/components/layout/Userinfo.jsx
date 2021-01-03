import React, { Component } from "react";
import UsersStore, { state, status } from "../../store/users";
import { observer } from "mobx-react";
import "./auth.scss";

import * as Icon from "react-bootstrap-icons";

class UserInfo extends Component {
	async logout() {
		await UsersStore.logout();
	}

	render() {
		if (UsersStore.getStatus() !== status.DONE) return null;
		if (UsersStore.getState() !== state.authorized) return null;
		if (!UsersStore.getCurrentUser()) return null;

		return (
			<div id="auth-wrapper">
				<div className="auth-status">
					<div className="collapsed-part"></div>
					<div className="user">
						<Icon.Person size="20px" className="icon" />
						<span>{UsersStore.getCurrentUserName()}</span>
						<button onClick={this.logout} title="Logout">
							<Icon.BoxArrowLeft size="20px" />
						</button>
					</div>
				</div>
			</div>
		);
	}
}
export default observer(UserInfo);
