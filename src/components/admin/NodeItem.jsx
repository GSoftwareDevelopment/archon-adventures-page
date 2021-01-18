import React, { Component } from "react";

import { CaretRightFill as IconCaretRight } from "react-bootstrap-icons";
import { CaretDownFill as IconCaretDown } from "react-bootstrap-icons";

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
					className="node-item"
					onDoubleClick={() => {
						if (this.props.onDoubleClick) this.props.onDoubleClick();
					}}
				>
					{haveChildrens && (
						<button
							onClick={() => {
								const nodeState = !this.state.isCollapsed;
								this.setState({ isCollapsed: nodeState });
								if (this.props.onToggleNode) this.props.onToggleNode(nodeState);
							}}
						>
							{this.state.isCollapsed ? <IconCaretRight /> : <IconCaretDown />}
						</button>
					)}

					<span>
						{this.props.icon}
						{this.state.title}
					</span>
				</div>
				{!this.state.isCollapsed && this.props.children}
			</div>
		);
	}
}
