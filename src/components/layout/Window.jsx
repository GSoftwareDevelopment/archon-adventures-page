import React, { Component } from "react";

import * as Icon from "react-bootstrap-icons";
import CustomScrollbar from "../layout/CustomScrollbar";

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
						<WindowButton icon="CaretDown" onClick={onMaximize} />
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
				{windowSize !== "minimized" && (
					<form>
						<CustomScrollbar>{children}</CustomScrollbar>
					</form>
				)}
			</div>
		);
	}
}
