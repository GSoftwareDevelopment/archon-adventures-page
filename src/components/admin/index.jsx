import React, { Component } from "react";
import UsersStore from "../../store/users";
import "./scss/admin.scss";

import { Route, Switch, withRouter } from "react-router-dom";

import Sidebar from "../general/Sidebar";
import { menu } from "./sidebar";
import SidebarMenu from "../general/SidebarMenu";

import Dashboard from "./Dashboard";
import Profile from "./Profile/";
import UsersManagement from "./UsersManagement/";
// import RestrictedArea from "./RestrictedArea";

class Admin extends Component {
	state = {
		isExpanded: true,
	};

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
					<Route path="/admin/profile" component={Profile} />
					<Route path="/admin/dashboard" component={Dashboard} />
					<Route path="/admin/users" component={UsersManagement} />
				</Switch>
				<Sidebar
					isExpanded={this.state.isExpanded}
					onToggle={(state) => {
						this.setState({ isExpanded: state });
					}}
				>
					<SidebarMenu
						items={menu}
						active={id}
						isExpanded={this.state.isExpanded}
					/>
				</Sidebar>
			</div>
		);
	}
}

export default withRouter(Admin);
