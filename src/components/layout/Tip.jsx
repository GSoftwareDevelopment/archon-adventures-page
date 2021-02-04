import React, { Component } from "react";

import { InfoCircle as IconHelp } from "react-bootstrap-icons";

export default class Tip extends Component {
	render() {
		return (
			<span className="tip" title={this.props.title}>
				<IconHelp />
			</span>
		);
	}
}
