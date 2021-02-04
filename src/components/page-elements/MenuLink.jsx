import "./scss/menu-link.scss";
import { observer } from "mobx-react";

import LayoutsStore from "../../store/layouts";
import { languageCheck } from "../../libs/utils";

import * as Messages from "../layout/Messages";
import { Link } from "react-router-dom";

function MenuLink(props) {
	const currentLayout = LayoutsStore.current;
	const defaultLang = currentLayout.defaultLang;
	const availableLangs = currentLayout.langs;
	const currentLang = LayoutsStore.getCurrentLang;

	const route = props.routes.find((entry) => entry.id === props.attr.id);
	if (!route) {
		return null;
	}

	const usedLang = languageCheck(
		currentLang,
		defaultLang,
		availableLangs.map((l) => l.symbol),
		(lang) => {
			if (props.attr.title) return props.attr.title[lang];
			return null;
		}
	);

	if (!usedLang) {
		Messages.toConsole(
			"debug.menuRouter.render.itemLangsNotDefined",
			props.key
		);
		return null;
	}

	if (props.attr._parentContentType === "router-menu")
		return (
			<li className="menu-link">
				<Link to={route.path} onClick={props.onClick}>
					{props.attr.title[usedLang]}
				</Link>
			</li>
		);
	else
		return (
			<Link className="menu-link" to={route.path} onClick={props.onClick}>
				{props.attr.title[usedLang]}
			</Link>
		);
}

export default observer(MenuLink);
