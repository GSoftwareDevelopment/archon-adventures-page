import React, { Component } from "react";

import { SIZE_PROP } from "./menu";
import { Folder2 as IconClose } from "react-bootstrap-icons";
import { Folder2Open as IconOpen } from "react-bootstrap-icons";

/**
 *
 * @typedef {Object} NodeItemPropsInterface
 * @property {JSX.Element} [icon] node icon (on left side)
 * @property {string} [title] node title
 * @property {boolean} [isCollapsed] if set to 'true' children elements are not show
 * @property {boolean} [selected] if set to 'true' element has set 'selected' class
 * @property {React.ReactNode} [children]
 * @property {function} [onClick] event function for click
 * @property {function} [onDobuleClick] event function for dobule-click
 */
export default class NodeItem extends Component {
	/**
	 *
	 * @param {NodeItemPropsInterface} props Component props
	 */
	constructor(props) {
		super(props);

		this.state = {
			isCollapsed: this.props.isCollapsed || true,
		};
	}

	render() {
		const haveChildrens = Boolean(this.props.children);
		let isCollapsed = this.state.isCollapsed;

		if (typeof this.props.isCollapsed === "boolean") {
			isCollapsed = this.props.isCollapsed;
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
					<span>{this.props.title}</span>
				</div>
				{!isCollapsed && this.props.children}
			</div>
		);
	}
}
