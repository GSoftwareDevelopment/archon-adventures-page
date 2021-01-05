import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import { Link } from "react-router-dom";
import Flag from "react-flags";
import { languageCheck } from "../../libs/utils";

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

		// const
		const defaultLang = LayoutsStore.getDefaultLang();
		const availableLangs = LayoutsStore.getAvailableLang();
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
						let newMenuElement = null;

						const route = routes.find((entry) => entry.name === item.name);

						const usedLang = languageCheck(
							currentLang,
							defaultLang,
							availableLangs.map((l) => l.symbol),
							(lang) => {
								return item.title[lang];
							}
						);
						if (!usedLang) {
							console.error(
								`Language entry is not defined in menu element #${index} :/`
							);
							return null;
						}
						if (route) {
							let path = route.path;
							newMenuElement = (
								<li key={item.name} className="link">
									<MenuLink
										path={path}
										title={item.title[usedLang]}
										onClick={this.collapse}
									/>
								</li>
							);
						} else {
							switch (item.name) {
								case "#lang_selector":
									newMenuElement = (
										<li key={item.name} className="lang-selector">
											<MenuLangSelector
												title={item.title[usedLang]}
												lang={usedLang}
											/>
										</li>
									);
									break;
								default:
									console.log(
										`Name '${item.name}' property of menu router item is not recognize.`
									);
									newMenuElement = null;
							}
						}
						return newMenuElement;
					})}
				</ul>
			</div>
		);
	}
}

function MenuLink(props) {
	return (
		<Link to={props.path} onClick={props.onClick}>
			{props.title}
		</Link>
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
		);
	}
}

export default observer(MenuRouter);
