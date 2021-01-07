import React, { Component } from "react";
import { observer } from "mobx-react";

import UsersStore, { status as userStatus } from "./store/users";
import LayoutsStore, { status } from "./store/layouts";

import { EmojiDizzy, EmojiFrown } from "react-bootstrap-icons";
import PageLayout from "./components/layout/PageLayout";

class App extends Component {
	async componentDidMount() {
		await UsersStore.init();
		await LayoutsStore.fetchGet({ current: true });
	}

	render() {
		switch (UsersStore.getStatus()) {
			case userStatus.DONE:
				switch (LayoutsStore.getStatus()) {
					case status.DONE:
						return <PageLayout />;
					case status.INIT:
					case status.PENDING:
						return <div className="content-loader">Loading...</div>;
					default:
						return (
							<div className="content-loader">
								<EmojiFrown size="64px" />
								<p>Layout error</p>
							</div>
						);
				}
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
