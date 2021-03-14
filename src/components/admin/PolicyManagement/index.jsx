import React, { Component } from "react";

import { ShieldShaded as IconPolicy } from "react-bootstrap-icons";

export default class PolicyManagement extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="header">
					<IconPolicy size="2em" />
					Policy Management
				</div>
			</React.Fragment>
		);
	}
}
