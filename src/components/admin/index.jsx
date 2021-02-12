import React, { Component } from "react";
import UsersStore from "../../store/users";
import "./scss/admin.scss";

import { Route, Switch, withRouter } from "react-router-dom";

import Sidebar from "../general/Sidebar";
import { menu } from "./sidebar";
import SidebarMenu from "../general/SidebarMenu";

import Dashboard from "./Dashboard";
import Profile from "./Profile/";

class Admin extends Component {
	backToSiteManager = () => {
		this.props.history.push("/");
	};

	logoutUser = async () => {
		await UsersStore.logout();
	};

	render() {
		const id = this.props.match.params.id;
		return (
			<div className="admin">
				<Switch>
					<Route path="/admin/dashboard" component={Dashboard} />
					<Route path="/admin/profile" component={Profile} />
				</Switch>
				<Sidebar isExpanded={true}>
					<SidebarMenu items={menu} active={id} />
				</Sidebar>
			</div>
		);
	}
}

export default withRouter(Admin);
