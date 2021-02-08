import "../../scss/sidebar.scss";

import React, { Component } from "react";
import UsersStore, { state, status } from "../../store/users";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import * as Icon from "react-bootstrap-icons";

//

class Sidebar extends Component {
	state = {
		isExpanded: false,
	};

	toggleVisibility = () => {
		this.setState({ isExpanded: !this.state.isExpanded });
	};

	render() {
		if (UsersStore.getStatus() !== status.DONE) return null;
		if (UsersStore.getState() !== state.authorized) return null;
		if (!UsersStore.getCurrentUser()) return null;

		const userName = UsersStore.getCurrentUserName();
		const isExpanded = this.state.isExpanded;

		return (
			<div className={"sidebar" + (isExpanded ? " isExpanded" : "")}>
				{this.props.children}
				<div className="sidebar-user">
					<button
						className="flat"
						onClick={() => {
							this.setState({ isExpanded: false });
							this.props.history.push("/admin/dashboard");
						}}
						title="Open Dashboard..."
					>
						<Icon.Person size="20px" className="icon" />
						<span>{userName}</span>
					</button>
					<button
						className="sidebar-toggler"
						onClick={this.toggleVisibility}
						title="Toggle Menu"
					>
						{isExpanded ? (
							<Icon.ChevronCompactDown size="20px" />
						) : (
							<Icon.ThreeDotsVertical size="20px" />
						)}
					</button>
				</div>
			</div>
		);
	}
}

export default observer(withRouter(Sidebar));
