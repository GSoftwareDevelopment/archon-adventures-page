import "./scss/router-content.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

import { Route } from "react-router-dom";

class RouterContent extends Component {
	render() {
		const { path, exact /*, elements */ } = this.props.attr;

		return (
			<Route path={path} exact={exact}>
				<div id="content-wrapper">{this.props.children}</div>
			</Route>
		);
	}
}

export default observer(RouterContent);
