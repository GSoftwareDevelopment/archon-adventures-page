import React, { Component } from "react";

import { ClipboardData as IconDashboard } from "react-bootstrap-icons";

export default class Dashboard extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="header">
					<IconDashboard size="2em" />
					Dashborad
				</div>
			</React.Fragment>
		);
	}
}
