import "./scss/tree-general.scss";

import React, { Component } from "react";

export default class NodeTree extends Component {
	render() {
		return (
			<div
				id={this.props.id}
				className="tree-container"
				style={{ display: this.props.visible ? "block" : "none" }}
			>
				{this.props.children}
			</div>
		);
	}
}
