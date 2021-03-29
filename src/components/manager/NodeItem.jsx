import React, { Component } from "react";

import { ICON_SIZE } from "../general/SidebarMenu";
import { Folder2 as IconClose } from "react-bootstrap-icons";
import { Folder2Open as IconOpen } from "react-bootstrap-icons";
import Drag from "../general/Drag";
import DropTarget from "../general/DropTarget";

/**
 *
 * @typedef {Object} NodeItemPropsInterface
 * @property {JSX.Element} [icon] node icon (on left side)
 * @property {string} [title] node title
 * @property {boolean} [isCollapsed] if set to 'true' children elements are not show
 * @property {boolean} [selected] if set to 'true' element has set 'selected' class
 * @property {boolean} allowDrag make element draggable
 * @property {*} dragData drag content data
 * @property {boolean} dropOnItem
 * @property {boolean} dropBefore
 * @property {boolean} dropAfter
 * @property {React.ReactNode} [children]
 * @property {function} [onToggleNode] event function for toggle node (collapsed/expanded)
 * @property {function} [onClick] event function for click
 * @property {function} [onDobuleClick] event function for dobule-click
 * @property {function} onItemDropped
 */
export default class NodeItem extends Component {
	/**
	 *
	 * @param {NodeItemPropsInterface} props Component props
	 */
	constructor(props) {
		super(props);

		this.state = {
			isCollapsed: true,
		};
	}

	toggleNode = () => {
		const nodeState = !this.state.isCollapsed;
		this.setState({ isCollapsed: nodeState });
		if (this.props.onToggleNode) this.props.onToggleNode(nodeState);
	};

	handleDropItem(src, place) {
		this.props.onItemDropped(src, place);
	}

	render() {
		const haveChildrens = Boolean(this.props.children);
		let isCollapsed = this.state.isCollapsed;

		if (typeof this.props.isCollapsed === "boolean") {
			isCollapsed = this.props.isCollapsed;
		}

		return (
			<div
				className={
					this.props.className +
					(this.props.selected ? " selected" : "") /* "node-collection" */
				}
			>
				{this.props.onItemDropped && this.props.dropBefore && (
					<DropTarget
						className="dropArea"
						onItemDropped={(src) => {
							this.handleDropItem(src, "before");
						}}
						dropEffect="copy"
					></DropTarget>
				)}

				<ConditionalWrapper
					condition={this.props.dropOnItem}
					wrapper={(children) => (
						<DropTarget
							onItemDropped={(src) => {
								this.handleDropItem(src, "before");
							}}
							dropEffect="copy"
						>
							{children}
						</DropTarget>
					)}
				>
					<ConditionalWrapper
						condition={
							Boolean(this.props.allowDrag) && Boolean(this.props.dragData)
						}
						wrapper={(children) => (
							<Drag
								dataItem={this.props.dragData || undefined}
								dropEffect="link"
							>
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
							title={this.props.tip}
						>
							{haveChildrens && (
								<button className="flat noPadding" onClick={this.toggleNode}>
									{isCollapsed ? (
										<IconClose size={ICON_SIZE} />
									) : (
										<IconOpen size={ICON_SIZE} />
									)}
								</button>
							)}

							{this.props.icon}
							<span>{this.props.title}</span>
							{this.props.extra}
						</div>
					</ConditionalWrapper>
				</ConditionalWrapper>

				<div className={"tree-container" + (!isCollapsed ? " expanded" : "")}>
					{this.props.children}
				</div>
				{this.props.onItemDropped && this.props.dropAfter && (
					<DropTarget
						className="dropArea after"
						onItemDropped={(src) => {
							this.handleDropItem(src, "after");
						}}
						dropEffect="copy"
					></DropTarget>
				)}
			</div>
		);
	}
}

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;
