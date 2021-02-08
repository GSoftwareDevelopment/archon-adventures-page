import "./scss/header.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

class Header extends Component {
	render() {
		return <header>{this.props.children}</header>;
	}
}

export default observer(Header);
