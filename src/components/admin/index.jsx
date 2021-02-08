import React, { Component } from "react";
import UsersStore from "../../store/users";
import { observer } from "mobx-react";
import "./scss/admin.scss";

import { withRouter } from "react-router-dom";

import { ClipboardData as IconDashboard } from "react-bootstrap-icons";
import Sidebar from "../general/Sidebar";
import { menu } from "./sidebar";
import SidebarMenu from "../general/SidebarMenu";

class Admin extends Component {
	backToSiteManager = () => {
		this.props.history.push("/");
	};

	logoutUser = async () => {
		await UsersStore.logout();
	};

	render() {
		return (
			<div className="admin">
				<div className="header">
					<IconDashboard size="2em" />
					Dashboard
				</div>
				<Sidebar>
					<SidebarMenu items={menu} active="dashboard" />
				</Sidebar>
			</div>
		);
	}
}

export default observer(withRouter(Admin));
