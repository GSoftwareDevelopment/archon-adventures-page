import React, { Component } from "react";

import { SIZE_PROP } from "./menu";
import { Folder2 as IconClose } from "react-bootstrap-icons";
import { Folder2Open as IconOpen } from "react-bootstrap-icons";
import Drag from "./Drag";

/**
 *
 * @typedef {Object} NodeItemPropsInterface
 * @property {JSX.Element} [icon] node icon (on left side)
 * @property {string} [title] node title
 * @property {boolean} [isCollapsed] if set to 'true' children elements are not show
 * @property {boolean} [selected] if set to 'true' element has set 'selected' class
 * @property {boolean} allowDrag make element draggable
 * @property {*} dragData drag content data
 * @property {React.ReactNode} [children]
 * @property {function} [onToggleNode] event function for toggle node (collapsed/expanded)
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

	toggleNode = () => {
		const nodeState = !this.state.isCollapsed;
		this.setState({ isCollapsed: nodeState });
		if (this.props.onToggleNode) this.props.onToggleNode(nodeState);
	};

	render() {
		const haveChildrens = Boolean(this.props.children);
		let isCollapsed = this.state.isCollapsed;

		if (typeof this.props.isCollapsed === "boolean") {
			isCollapsed = this.props.isCollapsed;
		}

		return (
			<div className="node-collection">
				<ConditionalWrapper
					condition={
						Boolean(this.props.allowDrag) && Boolean(this.props.dragData)
					}
					wrapper={(children) => (
						<Drag dataItem={this.props.dragData || undefined} dropEffect="link">
							{children}
						</Drag>
					)}
				>
					<div
						className={"node-item" + (this.props.selected ? " selected" : "")}
						onClick={() => {
							let toggle = true;
							if (this.props.onClick) toggle = this.props.onClick();
							if (toggle) this.toggleNode();
						}}
						onDoubleClick={() => {
							if (this.props.onDoubleClick) this.props.onDoubleClick();
						}}
					>
						{haveChildrens && (
							<button className="flat noPadding" onClick={this.toggleNode}>
								{isCollapsed ? (
									<IconClose size={SIZE_PROP} />
								) : (
									<IconOpen size={SIZE_PROP} />
								)}
							</button>
						)}

						{this.props.icon}
						<span>{this.props.title}</span>
					</div>
				</ConditionalWrapper>
				{!isCollapsed && this.props.children}
			</div>
		);
	}
}

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;
