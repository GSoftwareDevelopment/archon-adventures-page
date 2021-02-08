import "./scss/tree-general.scss";

import React, { Component } from "react";

export default class NodeTree extends Component {
	render() {
		return (
			<div
				id={this.props.id}
				className={"tree-container" + (this.props.visible ? " expanded" : "")}
			>
				{this.props.children}
			</div>
		);
	}
}
