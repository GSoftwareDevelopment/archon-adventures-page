import "./scss/sidebar.scss";

import React, { Component } from "react";
import UsersStore, { state, status } from "../../store/users";
import WindowsStore from "./store/windows";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import * as Icon from "react-bootstrap-icons";
import CustomScrollbar from "../layout/CustomScrollbar";
import SidebarMenu from "./SidebarMenu";

import { MenuRoot } from "./menu";
import { ButtonsGroup } from "./windows/Window";

//

class Sidebar extends Component {
	state = {
		isFocused: false,
		options: [],
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
				className={"auth-sidebar" + (this.state.isFocused ? " isFocused" : "")}
			>
				<div className="sidebar-menu">
					<CustomScrollbar>
						<div style={{ display: "flex", flexDirection: "column" }}>
							<SidebarMenu
								items={MenuRoot}
								onOpenWindow={() => {
									this.setState({ isFocused: false });
								}}
								setOptions={(opt) => {
									this.setState({ options: opt });
								}}
							/>
						</div>
					</CustomScrollbar>
				</div>
				{this.state.isFocused &&
					Boolean(this.state.options) &&
					Boolean(this.state.options.length) && (
						<ButtonsGroup
							className="options-group-button"
							onlyIcons={false}
							buttons={this.state.options}
						/>
					)}
				<WindowsList windowsStore={WindowsStore} />
				<div className="user">
					<button
						className="flat"
						onClick={() => {
							this.setState({ isFocused: false });
							this.props.history.push("/auth");
						}}
						title="Account"
					>
						<Icon.Person size="20px" className="icon" />
						<span>{userName}</span>
					</button>
					<button
						className="flat toggler"
						onClick={() => {
							this.setState({ isFocused: !this.state.isFocused });
						}}
						title="Toggle Site manager"
					>
						{this.state.isFocused ? (
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
