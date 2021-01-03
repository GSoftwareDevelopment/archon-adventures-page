import React, { Component } from "react";
import { observer } from "mobx-react";
// import RoutesStore, { status } from "../../store/routes";

import { Route } from "react-router-dom";
import Card from "../pages/Card";
import Calendar from "../pages/Calendar";

class RouterContent extends Component {
	parsePage(refTo, pageElements) {
		if (pageElements) {
			return pageElements.map(({ type, ...params }, index) => {
				let content = null;
				switch (type) {
					case "card":
						if (params.name) {
							content = <Card name={params.name} lang="en" />;
						} else {
							console.log("Card parameters are not defined!");
							return null;
						}
						break;
					case "calendar":
						content = <Calendar lang="en" />;
						break;
					default:
						console.log(`Can't recognize page element '${type}' :|`);
						return null;
				}
				return (
					<div key={index} id="main-content">
						{content}
					</div>
				);
			});
		} else {
			console.log(`Page '${refTo}' is empty`);
		}
	}

	render() {
		// const menuItems = RoutesStore.getRoutes();
		// if (RoutesStore.getStatus() !== status.DONE) return null;

		const { path, exact, elements } = this.props;
		return (
			<Route path={path} exact={exact}>
				<div id="content-wrapper">{this.parsePage(path, elements)}</div>
			</Route>
		);
	}
}

export default observer(RouterContent);
