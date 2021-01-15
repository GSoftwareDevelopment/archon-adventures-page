import "./scss/sidebar.scss";

import React, { Component } from "react";
import UsersStore, { state, status } from "../../store/users";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import * as Icon from "react-bootstrap-icons";
import CustomScrollbar from "../layout/CustomScrollbar";
import SidebarMenu from "./SidebarMenu";

import TreeLayouts from "./TreeLayouts";
import TreeCards from "./TreeCards";
import TreeCalendars from "./TreeCalendars";
import TreeGalleries from "./TreeGalleries";

import WindowsStore from "./store/windows";

const MenuRoot = [
	{ icon: "LayoutWtf", name: "Layouts", Component: TreeLayouts },
	{ icon: "Journals", name: "Cards", Component: TreeCards },
	{ icon: "Calendar3", name: "Calendars", Component: TreeCalendars },
	{ icon: "Images", name: "Galleries", Component: TreeGalleries },
	{ icon: "ChatRightText", name: "Comments", Component: null },
];

//

class Sidebar extends Component {
	state = {
		isFocused: false,
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
							/>
						</div>
					</CustomScrollbar>
				</div>
				<WindowsList windowsStore={WindowsStore} />
				<div className="user">
					<button
						className="toggler"
						onClick={() => {
							this.setState({ isFocused: !this.state.isFocused });
						}}
						title="Toggle Site manager"
					>
						{this.state.isFocused ? (
							<Icon.ChevronCompactDown size="20px" />
						) : (
							<Icon.ChevronCompactUp size="20px" />
						)}
					</button>
					<button
						onClick={() => {
							this.setState({ isFocused: !this.state.isFocused });
						}}
					>
						<Icon.Person size="20px" className="icon" />
						<span>{userName}</span>
					</button>
					<button
						onClick={() => {
							this.props.history.push("/auth");
						}}
						title="Account"
					>
						<Icon.Gear size="20px" />
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
