import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UsersStore from "../../store/users";

import NodeTree from "../general/NodeTree";

class Account extends Component {
	logout = () => {
		UsersStore.logout();
	};

	redirectToProfile = () => {
		this.props.history.push("/admin/profile");
	};

	render() {
		return (
			<NodeTree id="logout-user" visible={this.props.visible}>
				<div style={{ flexGrow: "1" }}>
					<button style={{ width: "100%" }} onClick={this.redirectToProfile}>
						Profile
					</button>
					<button style={{ width: "100%" }} onClick={this.logout}>
						Log out
					</button>
				</div>
			</NodeTree>
		);
	}
}

export default withRouter(Account);
