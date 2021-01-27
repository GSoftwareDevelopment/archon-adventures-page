import React, { Component } from "react";

import { SIZE_PROP } from "./menu";
import { Folder2 as IconClose } from "react-bootstrap-icons";
import { Folder2Open as IconOpen } from "react-bootstrap-icons";

export default class NodeItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCollapsed: true,
			title: this.props.title || "empty-node",
		};
	}

	render() {
		const haveChildrens = Boolean(this.props.children);
		return (
			<div className="node-collection">
				<div
					className={"node-item" + (this.props.selected ? " selected" : "")}
					onClick={() => {
						const nodeState = !this.state.isCollapsed;
						this.setState({ isCollapsed: nodeState });
						if (this.props.onToggleNode) this.props.onToggleNode(nodeState);
						if (this.props.onClick) this.props.onClick();
					}}
					onDoubleClick={() => {
						if (this.props.onDoubleClick) this.props.onDoubleClick();
					}}
				>
					{haveChildrens &&
						(this.state.isCollapsed ? (
							<IconClose size={SIZE_PROP} />
						) : (
							<IconOpen size={SIZE_PROP} />
						))}

					{this.props.icon}
					<span>{this.state.title}</span>
				</div>
				{!this.state.isCollapsed && this.props.children}
			</div>
		);
	}
}
