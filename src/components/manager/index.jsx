import React, { Component } from "react";
import WindowsStore from "../../store/windows";

import { DialogManager } from "../general/Window";
import { menu } from "./sidebar";
import Sidebar from "../general/Sidebar";
import SidebarMenu from "../general/SidebarMenu";
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
					<DialogManager windowsStore={WindowsStore} />
					<SidebarMenu
						style={{ paddingBottom: "50px" }}
						items={menu}
						isExpanded={this.state.isExpanded}
					/>
					<SidebarUser />
				</Sidebar>
			</React.Fragment>
		);
	}
}
