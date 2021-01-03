import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStores from "../../store/layouts";

import { Link } from "react-router-dom";

class MenuRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: true,
			currentLang: props.lang || "en",
		};
	}

	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};

	collapse = () => {
		this.setState({ collapsed: true });
	};

	render() {
		// if (RoutesStore.getStatus() !== status.DONE) return null;
		// const menuItems = RoutesStore.getRoutes();

		const menuItems = this.props.items;
		if (!menuItems || typeof menuItems !== "object" || menuItems.length === 0)
			return null;

		const routes = LayoutsStores.getSchema()
			.filter((part) => part.contentType === "router-content")
			.map((part) => ({
				name: part.name,
				path: part.path,
			}));

		return (
			<div id="main-menu" className={this.state.collapsed ? "collapsed" : ""}>
				<ul className="menu-pane">
					<li key="menu-toggler">
						<div className="toggler" onClick={this.toggleCollapse}>
							<img
								src="imgs/AtariLogo.png"
								alt="Menu"
								style={{ maxHeight: "32px" }}
							/>
						</div>
					</li>
					{menuItems.map((item, index) => {
						const route = routes.find((entry) => entry.name === item.name);
						let path = "";
						if (route) {
							path = route.path;
						}
						return (
							<li key={item.name}>
								<Link className="link" to={path} onClick={this.collapse}>
									{item.title[this.state.currentLang]}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default observer(MenuRouter);
