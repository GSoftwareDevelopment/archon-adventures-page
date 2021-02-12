import "../../scss/sidebar.scss";

import React, { Component } from "react";
import UsersStore, { state, status } from "../../store/users";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import {
	ThreeDotsVertical as IconExpand,
	ChevronCompactDown as IconCollaps,
} from "react-bootstrap-icons";

//

class Sidebar extends Component {
	state = {
		isExpanded: this.props.isExpanded,
	};

	toggleVisibility = () => {
		this.setState({ isExpanded: !this.state.isExpanded });
	};

	render() {
		if (UsersStore.getStatus() !== status.DONE) return null;
		if (UsersStore.getState() !== state.authorized) return null;
		if (!UsersStore.getCurrentUser()) return null;

		const isExpanded = this.state.isExpanded;

		return (
			<div className={"sidebar" + (isExpanded ? " isExpanded" : "")}>
				{this.props.children}
				<button
					className="sidebar-toggler"
					onClick={this.toggleVisibility}
					title="Toggle Menu"
				>
					{isExpanded ? (
						<IconCollaps size="32px" />
					) : (
						<IconExpand size="32px" />
					)}
				</button>
			</div>
		);
	}
}

export default observer(withRouter(Sidebar));
