import "../../scss/window.scss";

import React, { Component } from "react";
import WindowsStore from "../../store/windows.js";
import DialogManager from "./WindowComponents/DialogManager";
import DialogSelector from "./WindowComponents/DialogSelector";

import * as Icon from "react-bootstrap-icons";

import Input from "./WindowComponents/Input";
import InputML from "./WindowComponents/InputML";
import InputPathName from "./WindowComponents/InputPathName";
import Checkbox from "./WindowComponents/Checkbox";
import ButtonsGroup from "./WindowComponents/ButtonsGroup";
import SelectList from "./WindowComponents/SelectList";

export {
	DialogManager,
	DialogSelector,
	Input,
	InputML,
	InputPathName,
	Checkbox,
	ButtonsGroup,
	SelectList,
};

//

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
				{windowState !== "minimized" && onMinimize ? (
					<WindowButton icon="CaretRight" onClick={onMinimize} />
				) : null}
				{onClose && <WindowButton icon="X" onClick={onClose} />}
			</div>
		);
	}
}

export class Window extends Component {
	static defaultProps = {
		sizeCycle: ["maximized", "panel", "minimized"],
	};

	state = {
		windowSize: this.props.size || "panel",
	};

	componentDidUpdate(prevProps) {
		if (prevProps.size !== this.props.size)
			this.setState({ windowSize: this.props.size });
	}

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
			<div
				className={className + (windowStateClass || "")}
				style={{
					...this.props.style,
					// display: windowSize === "minimized" ? "none" : "",
				}}
			>
				<div className="header">
					<span title={title}>{title}</span>
					<WindowControl
						windowState={windowSize}
						onMinimize={!disableMinimize ? this.minimize : null}
						onMaximize={!disableMaximize ? this.maximize : null}
						onClose={onClose}
					/>
				</div>
				<form id={`form-${this.props.winId}`}>{children}</form>
				<DialogManager
					className="align-windows-column inner-windows"
					windowsStore={WindowsStore}
					group={this.props.winId}
				/>
			</div>
		);
	}
}
