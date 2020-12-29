import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import menuItems from "./menuItems";

import Card from "../pages/Card";
import Calendar from "../pages/Calendar";

export default class ContentPage extends Component {
	parsePage(refTo, pageElements) {
		if (pageElements) {
			return pageElements.map(({ type, ...params }, index) => {
				switch (type) {
					case "card":
						if (params.name) {
							return <Card key={index} name={params.name} lang="en" />;
						} else {
							console.log("Card parameters are not defined!");
							return null;
						}
					case "calendar":
						return <Calendar key={index} lang="en" />;
					default:
						console.log(`Can't recognize page element '${type}' :|`);
						return null;
				}
			});
		} else {
			console.log(`Page '${refTo}' is empty`);
		}
	}

	render() {
		return (
			<Switch>
				{menuItems.map((item, index) => {
					if (item.refTo) {
						return (
							<Route key={index} path={item.refTo} exact={item.exact || false}>
								<div id="main-wrapper">
									{this.parsePage(item.refTo, item.elements)}
								</div>
							</Route>
						);
					} else {
						return null;
					}
				})}
			</Switch>
		);
	}
}
