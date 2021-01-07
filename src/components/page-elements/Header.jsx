import "./scss/header.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

import UserInfo from "../layout/Userinfo";

class Header extends Component {
	render() {
		return (
			<header>
				<UserInfo />
				{this.props.children}
			</header>
		);
	}
}

export default observer(Header);
