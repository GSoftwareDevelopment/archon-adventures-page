import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default class CustomScrollbar extends Component {
	render() {
		return (
			<Scrollbars
				autoHide={true}
				style={this.props.style || { width: "100%", height: "100%" }}
				renderThumbHorizontal={(props) => (
					<div {...props} className="thumb-horizontal" />
				)}
				renderThumbVertical={(props) => (
					<div {...props} className="thumb-vertical" />
				)}
			>
				{this.props.children}
			</Scrollbars>
		);
	}
}
