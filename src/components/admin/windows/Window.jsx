import "../scss/window.scss";

import React, { Component } from "react";

import * as Icon from "react-bootstrap-icons";
// import CustomScrollbar from "../../layout/CustomScrollbar";

export class WindowButton extends Component {
	render() {
		const ButtonIcon = this.props.icon ? Icon[this.props.icon] : null;
		return (
			<button disabled={!Boolean(ButtonIcon)} onClick={this.props.onClick}>
				{Boolean(ButtonIcon) && <ButtonIcon size="16px" />}
			</button>
		);
	}
}

export class WindowControl extends Component {
	render() {
		const { onMaximize, onClose, onMinimize, windowState } = this.props;
		return (
			<div>
				{windowState !== "maximized" && onMaximize ? (
					windowState === "minimized" ? (
						<WindowButton icon="CaretUp" onClick={onMaximize} />
					) : (
						<WindowButton icon="CaretLeft" onClick={onMaximize} />
					)
				) : (
					<WindowButton icon={null} />
				)}
				{onClose && <WindowButton icon="X" onClick={onClose} />}
				{windowState !== "minimized" && onMinimize ? (
					<WindowButton icon="CaretRight" onClick={onMinimize} />
				) : null}
			</div>
		);
	}
}

export default class Window extends Component {
	constructor(props) {
		super(props);
		this.state = {
			windowSize: "panel",
		};
	}

	maximize = () => {
		const { onMaximize } = this.props;

		switch (this.state.windowSize) {
			case "minimized":
				this.setState({ windowSize: "panel" });
				break;
			default:
				this.setState({ windowSize: "maximized" });
				if (onMaximize) onMaximize();
				break;
		}
	};

	minimize = () => {
		const { onMinimize } = this.props;

		switch (this.state.windowSize) {
			case "maximized":
				this.setState({ windowSize: "panel" });
				break;
			default:
				this.setState({ windowSize: "minimized" });
				if (onMinimize) onMinimize();
				break;
		}
	};

	render() {
		const { className, title, onClose, children } = this.props;

		const windowSize = this.state.windowSize;
		let windowStateClass = "";
		switch (windowSize) {
			case "minimized":
				windowStateClass = " minimized";
				break;
			case "maximized":
				windowStateClass = " maximized";
				break;
			default:
				windowStateClass = "";
		}
		return (
			<div className={className + windowStateClass}>
				<div className="header">
					<span title={title}>{title}</span>
					<WindowControl
						windowState={windowSize}
						onMinimize={this.minimize}
						onMaximize={this.maximize}
						onClose={onClose}
					/>
				</div>
				{windowSize !== "minimized" && <form>{children}</form>}
			</div>
		);
	}
}

//

export function Input({ className, type, name, label, ...props }) {
	return label ? (
		<div className={className}>
			<label htmlFor={name}>{label}</label>
			<input name={name} id={name} type={type} autoComplete="off" {...props} />
		</div>
	) : (
		<input name={name} id={name} type={type} autoComplete="off" {...props} />
	);
}

//

export const ButtonsGroup = ({ className, style, onlyIcons, buttons }) => (
	<div className={className} style={style}>
		{buttons.map((btn, index) => {
			if (typeof btn.visible === "boolean" && !btn.visible) return null;

			if (btn.component) {
				return (
					<div
						key={index}
						className={btn.className}
						style={btn.style}
						disabled={typeof btn.enabled === "boolean" ? !btn.enabled : false}
						title={btn.title}
					>
						{btn.component}
					</div>
				);
			} else
				return (
					<button
						key={index}
						onClick={(e) => {
							e.preventDefault();
							if (btn.onClick) btn.onClick(e);
						}}
						disabled={typeof btn.enabled === "boolean" ? !btn.enabled : false}
						className={btn.className}
						style={btn.style}
						title={Boolean(onlyIcons) ? btn.title : ""}
					>
						{btn.icon}
						{!Boolean(onlyIcons) && btn.title}
					</button>
				);
		})}
	</div>
);

//

export const SelectList = ({
	className,
	list,
	onItemRender,
	onChoice,
	...props
}) => {
	const totalItems = list.length;
	return (
		<div className={"select-list " + className}>
			{list.map((listItem, index) => {
				const { isChoiced, before, item, after } = onItemRender(listItem, {
					index,
					firstItem: index === 0,
					lastItem: index === totalItems - 1,
				});

				return (
					<React.Fragment key={index}>
						{before}
						<div
							className={"list-row selectable" + (isChoiced ? " choiced" : "")}
							onClick={() => {
								onChoice(listItem);
							}}
						>
							{item}
						</div>
						{after}
					</React.Fragment>
				);
			})}
		</div>
	);
};
