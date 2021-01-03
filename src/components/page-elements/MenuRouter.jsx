import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import { Link } from "react-router-dom";
import Flag from "react-flags";

class MenuRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: true,
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

		const routes = LayoutsStore.getSchema()
			.filter((part) => part.contentType === "router-content")
			.map((part) => ({
				name: part.name,
				path: part.path,
			}));

		const defaultLang = LayoutsStore.getDefaultLang();
		let currentLang = LayoutsStore.getCurrentLang(); // this.state.currentLang;

		return (
			<div id="main-menu" className={this.state.collapsed ? "collapsed" : ""}>
				<ul className="menu-pane">
					<li
						key="menu-toggler"
						className="toggler link"
						onClick={this.toggleCollapse}
					>
						<img
							src="/imgs/AtariLogo.png"
							alt="Menu"
							style={{ maxHeight: "32px" }}
						/>
					</li>
					{menuItems.map((item, index) => {
						const route = routes.find((entry) => entry.name === item.name);
						let title;
						if (!item.title[currentLang]) {
							if (currentLang !== defaultLang) {
								currentLang = defaultLang;
								title = item.title[defaultLang];
							}
							if (!title) {
								currentLang = "";
								title = item.title[0];
							}
						} else {
							title = item.title[currentLang];
						}
						if (route) {
							let path = route.path;
							return (
								<MenuLink
									key={item.name}
									path={path}
									title={item.title[currentLang]}
									onClick={this.collapse}
								/>
							);
						} else {
							switch (item.name) {
								case "#lang_selector":
									return (
										<MenuLangSelector
											key={item.name}
											title={item.title[currentLang]}
											lang={currentLang}
										/>
									);
								default:
									console.log(
										`Name '${item.name}' property of menu router item is not recognize.`
									);
									return null;
							}
						}
					})}
				</ul>
			</div>
		);
	}
}

function MenuLink(props) {
	return (
		<li className="link">
			<Link to={props.path} onClick={props.onClick}>
				{props.title}
			</Link>
		</li>
	);
}

class MenuLangSelector extends Component {
	changeLanguage(newLang) {
		LayoutsStore.setCurrentLang(newLang);
		console.log("Switch language to: ", newLang);
	}

	render() {
		const langList = LayoutsStore.getAvailableLang();

		return (
			<li className="lang-selector">
				<ul>
					{langList.map((langDef) => {
						let langSymbol = langDef.symbol;
						return (
							<li
								key={langSymbol}
								title={langDef.name}
								onClick={() => {
									this.changeLanguage(langSymbol);
								}}
							>
								<Flag
									name={langSymbol === "en" ? "GB" : langSymbol}
									format="svg"
									alt={langDef.name}
									basePath="/imgs/flags"
								/>
							</li>
						);
					})}
				</ul>
			</li>
		);
	}
}

export default observer(MenuRouter);
