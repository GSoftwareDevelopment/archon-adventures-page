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
				) : null}
				{onClose && <WindowButton icon="X" onClick={onClose} />}
				{windowState !== "minimized" && onMinimize ? (
					<WindowButton icon="CaretRight" onClick={onMinimize} />
				) : null}
			</div>
		);
	}
}

export default class Window extends Component {
	static defaultProps = {
		sizeCycle: ["maximized", "panel", "minimized"],
	};

	state = {
		windowSize: this.props.size || "panel",
	};

	maximize = () => {
		const { onMaximize } = this.props;

		let sizeIndex = this.props.sizeCycle.indexOf(this.state.windowSize);
		if (sizeIndex > 0) sizeIndex--;

		const windowSize = this.props.sizeCycle[sizeIndex];
		this.setState({ windowSize });
		if (onMaximize) onMaximize(windowSize);
	};

	minimize = () => {
		const { onMinimize } = this.props;

		let sizeIndex = this.props.sizeCycle.indexOf(this.state.windowSize);
		if (sizeIndex < this.props.sizeCycle.length - 1) sizeIndex++;

		const windowSize = this.props.sizeCycle[sizeIndex];
		this.setState({ windowSize });
		if (onMinimize) onMinimize(windowSize);
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

		const disableMaximize = this.props.disableMaximize || false;
		const disableMinimize = this.props.disableMinimize || false;
		return (
			<div className={className + windowStateClass}>
				<div className="header">
					<span title={title}>{title}</span>
					<WindowControl
						windowState={windowSize}
						onMinimize={!disableMinimize ? this.minimize : null}
						onMaximize={!disableMaximize ? this.maximize : null}
						onClose={onClose}
					/>
				</div>
				{windowSize !== "minimized" && <form>{children}</form>}
			</div>
		);
	}
}

//
/**
 *
 * @typedef {Object} InputPropsInterface
 * @property {string} [className] - Class string definition
 * @property {string} type - Element <input type="..." /> attribute
 * @property {string} [name] - Element <input name="..." /> attribute
 * @property {string} [label] - Element label
 * @property {object} [props] - Props for <input> element
 */
/**
 * Show input element with associated label (if exists)
 * @param {InputPropsInterface} param0 Component props
 */
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
/**
 * Interface of element for array of button or components list in ButtonsGroupInterface
 * @typedef {object} ButtonsInterface
 * @property {JSX.Element} [component] Component to display in group (have priority if defined)
 * @property {JSX.Element} [icon] Icon component to display in left side of button
 * @property {string} [className] Class string definition
 * @property {React.CSSProperties} [style]
 * @property {string} [title] Button title
 * @property {string} [tip] Tooltip for button or component
 * @property {boolean} [enabled=true] Activity of element in group
 * @property {boolean} [visible=true] Visibility of element in group
 * @property {function} [onClick] Event function on mouse click
 */
/**
 * Interface of ButtonsGroup component props
 * @typedef {object} ButtonsGroupPropsInterface
 * @property {string} [className] Class string definition
 * @property {React.CSSProperties} [style]
 * @property {boolean} [onlyIcons] Show only icons (if available)
 * @property {...ButtonsInterface} buttons Array of buttons or components list
 */
/**
 * Show buttons or components in group
 * @param {ButtonsGroupPropsInterface} param0 Component props
 */
export const ButtonsGroup = ({ className, style, onlyIcons, buttons }) => (
	<div className={className} style={style}>
		{buttons.map((btn: ButtonsInterface, index) => {
			if (typeof btn.visible === "boolean" && !btn.visible) return null;
			let title = false;
			if (typeof btn.title === "string") {
				title = btn.title.trim();
			}
			if (btn.component) {
				return (
					<div
						key={index}
						className={btn.className}
						style={btn.style}
						disabled={typeof btn.enabled === "boolean" ? !btn.enabled : false}
						title={btn.tip || title}
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
						title={Boolean(onlyIcons) ? btn.tip || title : btn.tip}
					>
						{btn.icon}
						{!Boolean(onlyIcons) && Boolean(title) && (
							<span style={{ marginLeft: "5px" }}>{title}</span>
						)}
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
