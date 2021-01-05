import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";
import * as Messages from "../layout/Messages";
import { languageCheck } from "../../libs/utils";

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

	parseMenuItem(item, index) {
		let newMenuElement = null,
			className;

		const route = this.routes.find((entry) => entry.name === item.name);

		const usedLang = languageCheck(
			this.currentLang,
			this.defaultLang,
			this.availableLangs.map((l) => l.symbol),
			(lang) => {
				return item.title[lang];
			}
		);
		if (!usedLang) {
			Messages.toConsole("debug.menuRouter.render.itemLangsNotDefined", index);
			return null;
		}
		if (route) {
			let path = route.path;
			className = "link";
			newMenuElement = (
				<MenuLink
					path={path}
					title={item.title[usedLang]}
					onClick={this.collapse}
				/>
			);
		} else {
			switch (item.name) {
				case "#lang_selector":
					className = "lang-selector";
					newMenuElement = (
						<MenuLangSelector title={item.title[usedLang]} lang={usedLang} />
					);
					break;
				default:
					Messages.toConsole("debug.menuRouter.render.badSymbol", item.name);
					newMenuElement = null;
			}
		}
		return (
			<li key={item.name} className={className}>
				{newMenuElement}
			</li>
		);
	}

	render() {
		// if (RoutesStore.getStatus() !== status.DONE) return null;
		// const menuItems = RoutesStore.getRoutes();

		const menuItems = this.props.items;
		if (!menuItems || typeof menuItems !== "object" || menuItems.length === 0)
			return null;

		this.routes = LayoutsStore.getSchema()
			.filter((part) => part.contentType === "router-content")
			.map((part) => ({
				name: part.name,
				path: part.path,
			}));

		this.defaultLang = LayoutsStore.getDefaultLang();
		this.availableLangs = LayoutsStore.getAvailableLang();
		this.currentLang = LayoutsStore.getCurrentLang();

		return (
			<div id="main-menu" className={this.state.collapsed ? "collapsed" : ""}>
				<ul className="menu-pane">
					<MenuToggler onClick={this.toggleCollapse} />
					{menuItems.map((item, index) => {
						return this.parseMenuItem(item, index);
					})}
				</ul>
			</div>
		);
	}
}

function MenuToggler(props) {
	return (
		<li
			key="menu-toggler"
			className="toggler link"
			onClick={() => {
				props.onClick();
			}}
		>
			<img src="/imgs/AtariLogo.png" alt="Menu" style={{ maxHeight: "32px" }} />
		</li>
	);
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
		Messages.toConsole(
			"debug.menuRouter.userAction.changeLangPreference",
			newLang
		);
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
