import React, { Component } from "react";
import { observer } from "mobx-react";

import UsersStore, {
	status as userStatus,
	state as userState,
} from "./store/users";

import { EmojiDizzy } from "react-bootstrap-icons";
import PageLayout from "./components/layout/PageLayout";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import Login from "./Login";
import Admin from "./components/admin";
import SiteManager from "./components/manager/";
import { ToastContainer } from "react-toastify";

class App extends Component {
	async componentDidMount() {
		await UsersStore.init();
	}

	render() {
		const authStatus = UsersStore.getStatus();
		switch (authStatus) {
			case userStatus.DONE:
			case userStatus.WARN:
			case userStatus.SILENT:
				const authState = UsersStore.getState();
				return (
					<Router>
						<ToastContainer
							position="bottom-left"
							draggable
							pauseOnHover
							pauseOnFocusLoss
						/>
						<Switch>
							<Route key="authorize" exact path="/auth">
								<div className="fullscreen h-center v-center">
									<Login />
								</div>
							</Route>
							<Route key="admin" exact path="/admin/:id">
								{authState === userState.authorized ? (
									<div className="fullscreen">
										<Admin />
									</div>
								) : (
									<Redirect to="/auth" />
								)}
							</Route>
							<PageLayout>
								<SiteManager />
							</PageLayout>
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
