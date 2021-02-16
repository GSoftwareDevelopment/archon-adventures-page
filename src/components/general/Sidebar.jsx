import "../../scss/sidebar.scss";

import React, { Component } from "react";
import UsersStore, { state } from "../../store/users";
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
		const isExpanded = !this.state.isExpanded;
		if (this.props.onToggle) this.props.onToggle(isExpanded);
		this.setState({ isExpanded });
	};

	render() {
		// if (UsersStore.getStatus() !== status.DONE) return null;
		if (UsersStore.getState() !== state.authorized) return null;
		if (!UsersStore.getCurrentUser()) return null;

		const isExpanded = this.state.isExpanded;

		return (
			<React.Fragment>
				<div className="sidebar">{this.props.children}</div>
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
			</React.Fragment>
		);
	}
}

export default observer(withRouter(Sidebar));
