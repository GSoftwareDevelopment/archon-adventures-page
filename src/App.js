import React, { Component } from "react";
import { observer } from "mobx-react";

import UsersStore, { status as userStatus } from "./store/users";
// import LayoutsStore from "./store/layouts";

import { EmojiDizzy } from "react-bootstrap-icons";
import PageLayout from "./components/layout/PageLayout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/admin/Login";
import Sidebar from "./components/admin/Sidebar";

class App extends Component {
	async componentDidMount() {
		await UsersStore.init();
		// await LayoutsStore.fetchGet({ current: true });
	}

	render() {
		switch (UsersStore.getStatus()) {
			case userStatus.DONE:
				return (
					<Router>
						<Sidebar />
						<Switch>
							<Route key="authorize" exact path="/auth" component={Login} />

							<PageLayout />
						</Switch>
					</Router>
				);
			case userStatus.INIT:
			case userStatus.PENDING:
				return <div className="content-loader">Initializing...</div>;
			default:
				return (
					<div className="content-loader">
						<EmojiDizzy size="64px" />
						<p>Boot error</p>
					</div>
				);
		}
	}
}

export default observer(App);
