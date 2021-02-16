import React, { Component } from "react";
import WindowsStore from "../../store/windows";

import Sidebar from "../general/Sidebar";
import { menu } from "./sidebar";
import SidebarMenu from "../general/SidebarMenu";
import WindowsList from "../general/WindowsList";
import SidebarUser from "../general/SidebarUser";

export default class SiteManager extends Component {
	state = {
		isExpanded: false,
	};
	render() {
		return (
			<React.Fragment>
				<Sidebar
					onToggle={(state) => {
						this.setState({ isExpanded: state });
					}}
				>
					<WindowsList windowsStore={WindowsStore} />
					<SidebarMenu items={menu} isExpanded={this.state.isExpanded} />
					<SidebarUser />
				</Sidebar>
			</React.Fragment>
		);
	}
}
