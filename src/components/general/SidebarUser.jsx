import React, { Component } from "react";
import UsersStore from "../../store/users";
import { withRouter } from "react-router-dom";
import { ICON_SIZE } from "./SidebarMenu";

import * as Icon from "react-bootstrap-icons";

class SidebarUser extends Component {
	render() {
		const userName = UsersStore.getCurrentUserName();

		return (
			<div className="sidebar-user">
				<button
					className="flat"
					onClick={() => {
						this.props.history.push("/admin/dashboard");
					}}
					title="Open Dashboard..."
				>
					<Icon.Person size={ICON_SIZE} />
					<span>{userName}</span>
				</button>
			</div>
		);
	}
}

export default withRouter(SidebarUser);
