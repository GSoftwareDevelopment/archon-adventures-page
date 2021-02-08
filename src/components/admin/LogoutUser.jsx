import React, { Component } from "react";
import UsersStore from "../../store/users";

import NodeTree from "../general/NodeTree";

export default class LogoutUser extends Component {
	logout = () => {
		UsersStore.logout();
	};

	render() {
		return (
			<NodeTree id="logout-user" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<button onClick={this.logout}>Do it...</button>
				</div>
			</NodeTree>
		);
	}
}
