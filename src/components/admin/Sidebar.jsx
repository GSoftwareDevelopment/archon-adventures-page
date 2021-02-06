import "./scss/sidebar.scss";

import React, { Component } from "react";
import UsersStore, { state, status } from "../../store/users";
import WindowsStore from "./store/windows";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import * as Icon from "react-bootstrap-icons";
import SidebarMenu from "./SidebarMenu";

import { MenuRoot } from "./menu";

//

class Sidebar extends Component {
	state = {
		isExpanded: false,
	};

	async logout() {
		await UsersStore.logout();
	}

	render() {
		if (UsersStore.getStatus() !== status.DONE) return null;
		if (UsersStore.getState() !== state.authorized) return null;
		if (!UsersStore.getCurrentUser()) return null;

		const userName = UsersStore.getCurrentUserName();
		// const winList = WindowsStore.getWindows();

		return (
			<div
				className={
					"auth-sidebar" + (this.state.isExpanded ? " isExpanded" : "")
				}
			>
				<SidebarMenu
					visible={this.state.isExpanded}
					items={MenuRoot}
					onOpenWindow={() => {
						this.setState({ isExpanded: false });
					}}
				/>
				<WindowsList windowsStore={WindowsStore} />
				<div className="user">
					<button
						className="flat"
						onClick={() => {
							this.setState({ isExpanded: false });
							this.props.history.push("/auth");
						}}
						title="Account"
					>
						<Icon.Person size="20px" className="icon" />
						<span>{userName}</span>
					</button>
					<button
						className="round flat toggler"
						onClick={() => {
							this.setState({ isExpanded: !this.state.isExpanded });
						}}
						title="Toggle Site manager"
					>
						{this.state.isExpanded ? (
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

const WindowsList = observer(({ windowsStore }) => {
	return windowsStore.windows.map((wnd) => {
		const Win = wnd.Win[0];
		return (
			<Win
				{...wnd.props}
				key={wnd.id}
				onClose={() => {
					WindowsStore.removeWindowById(wnd.id);
				}}
			/>
		);
	});
});

export default observer(withRouter(Sidebar));
