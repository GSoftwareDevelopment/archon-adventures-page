import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import { Route } from "react-router-dom";
import Card from "./Card";
import Calendar from "./Calendar";

class RouterContent extends Component {
	parsePage(refTo, pageElements, lang) {
		if (pageElements) {
			return pageElements.map(({ type, ...params }, index) => {
				let content = null;
				switch (type) {
					case "card":
						if (params.name) {
							content = <Card name={params.name} lang={lang} />;
						} else {
							console.log("Card parameters are not defined!");
							return null;
						}
						break;
					case "calendar":
						content = <Calendar lang={lang} />;
						break;
					default:
						console.error(`Can't recognize page element '${type}' :|`);
						return null;
				}
				return (
					<div key={index} id="main-content">
						{content}
					</div>
				);
			});
		} else {
			console.warn(`Page '${refTo}' is empty`);
		}
	}

	render() {
		const currentLang = LayoutsStore.getCurrentLang();
		const { path, exact, elements } = this.props;

		return (
			<Route path={path} exact={exact}>
				<div id="content-wrapper">
					{this.parsePage(path, elements, currentLang)}
				</div>
			</Route>
		);
	}
}

export default observer(RouterContent);
