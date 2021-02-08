import React, { Component } from "react";
import WindowsStore from "../../store/windows";

import Sidebar from "../general/Sidebar";
import { menu } from "./sidebar";
import SidebarMenu from "../general/SidebarMenu";
import WindowsList from "../general/WindowsList";
import SidebarUser from "../general/SidebarUser";

export default class SiteManager extends Component {
	render() {
		return (
			<Sidebar>
				<SidebarMenu items={menu} />
				<WindowsList windowsStore={WindowsStore} />
				<SidebarUser />
			</Sidebar>
		);
	}
}
