import React, { Component } from "react";
import { observer } from "mobx-react";
// import LayoutsStore, { status } from "../../store/layouts";

import UserInfo from "../layout/Userinfo";
import MenuRouter from "./MenuRouter";

class Header extends Component {
	render() {
		// if (LayoutsStore.getStatus() !== status.DONE) return null;
		// const headerElements = LayoutsStore.getSchemeElements("header");
		// console.log(headerElements);
		const headerElements = this.props.elements;
		return (
			<header>
				<UserInfo />
				{headerElements.map((element, index) => {
					switch (element.type) {
						case "router-menu":
							return <MenuRouter key={index} items={element.items} lang="en" />;
						default:
							console.log("Element not recognize!");
							return null;
					}
				})}
			</header>
		);
	}
}

export default observer(Header);
