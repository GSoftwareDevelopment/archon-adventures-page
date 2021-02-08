import React, { Component } from "react";
import WindowsStore from "../../store/windows";

import Sidebar from "../general/Sidebar";
import { menuSiteManager } from "../general/menu-SiteManager";
import SidebarMenu from "../general/SidebarMenu";
import WindowsList from "../general/WindowsList";

export default class SiteManager extends Component {
	render() {
		return (
			<Sidebar>
				<SidebarMenu items={menuSiteManager} />
				<WindowsList windowsStore={WindowsStore} />
			</Sidebar>
		);
	}
}
