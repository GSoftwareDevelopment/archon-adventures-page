import React, { Component } from "react";

import { SIZE_PROP } from "./menu";
import { Folder2 as IconClose } from "react-bootstrap-icons";
import { Folder2Open as IconOpen } from "react-bootstrap-icons";

export default class NodeItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCollapsed: this.props.isCollapsed || true,
			title: this.props.title || "empty-node",
		};
	}

	render() {
		const haveChildrens = Boolean(this.props.children);
		let isCollapsed = this.state.isCollapsed;
		if (typeof this.props.isCollapsed === "boolean") {
			isCollapsed = this.props.isCollapsed;
			console.log(isCollapsed);
		}
		return (
			<div className="node-collection">
				<div
					className={"node-item" + (this.props.selected ? " selected" : "")}
					onClick={() => {
						let toggle = true;
						if (this.props.onClick) toggle = this.props.onClick();
						if (toggle) {
							const nodeState = !isCollapsed;
							this.setState({ isCollapsed: nodeState });
							if (this.props.onToggleNode) this.props.onToggleNode(nodeState);
						}
					}}
					onDoubleClick={() => {
						if (this.props.onDoubleClick) this.props.onDoubleClick();
					}}
				>
					{haveChildrens &&
						(isCollapsed ? (
							<IconClose size={SIZE_PROP} />
						) : (
							<IconOpen size={SIZE_PROP} />
						))}

					{this.props.icon}
					<span>{this.state.title}</span>
				</div>
				{!isCollapsed && this.props.children}
			</div>
		);
	}
}
