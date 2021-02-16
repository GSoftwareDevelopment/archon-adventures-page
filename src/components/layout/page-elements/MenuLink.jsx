import "./scss/menu-link.scss";
import { observer } from "mobx-react";

import LayoutsStore, { ContentTypes } from "../../../store/layouts";
import { languageCheck } from "../../../libs/utils";
import { Path } from "../../../setup";

import * as Messages from "../../../libs/Messages";
import { Link } from "react-router-dom";

function MenuLink({ routes, attr, ...props }) {
	const currentLayout = LayoutsStore.current;
	const defaultLang = currentLayout.defaultLang;
	const availableLangs = currentLayout.langs;
	const currentLang = LayoutsStore.getCurrentLang;

	let destRoute = attr.destRoute?.trim();
	if (!destRoute) {
		// for back compatibility
		const route = routes?.find((entry) => entry.id === attr.id);
		if (route) {
			destRoute = route.path.trim();
		} else {
			console.log("Route ID#%o not exist", attr.id);
			return;
		}
	}

	const _parts = destRoute.split("/");
	const routesData = LayoutsStore.getElementsByContentType(
		ContentTypes.ROUTERCONTENT
	).map((element) => ({
		id: element.id,
		path: element.path,
	}));

	let resultPath = [];

	for (let dir of _parts) {
		if (dir[0] === "#") {
			let id = dir.slice(1);
			const route = routesData.find((entry) => entry.id === id);
			if (!route) {
				console.log("Route ID#%o not exist", id);
				return;
			}
			if (!route.path.trim()) {
				console.log("Route path in ID#%o is not defined", id);
				return;
			}
			let _routePath = route.path;
			if (_routePath[0] === "/") _routePath = _routePath.slice(1);
			if (_routePath[_routePath.length - 1] === "/")
				_routePath = _routePath.slice(0, _routePath.length - 1);
			if (_routePath.trim()) resultPath.push(_routePath);
			continue;
		}

		if (dir.trim()) resultPath.push(dir);
	}

	destRoute = "/" + resultPath.join("/");

	const usedLang = languageCheck(
		currentLang,
		defaultLang,
		availableLangs.map((l) => l.symbol),
		(lang) => {
			if (attr.title) return attr.title[lang];
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

	return (
		<ConditionalWrapper
			condition={attr._parentContentType === "router-menu"}
			wrapper={(children) => <li className="menu-link">{children}</li>}
		>
			<Link to={destRoute} onClick={props.onClick}>
				{attr.title[usedLang]}
			</Link>
		</ConditionalWrapper>
	);

	// if (attr._parentContentType === "router-menu")
	// 	return (
	// 		<li className="menu-link">
	// 			<Link to={destRoute} onClick={props.onClick}>
	// 				{attr.title[usedLang]}
	// 			</Link>
	// 		</li>
	// 	);
	// else
	// 	return (
	// 		<Link className="menu-link" to={route.path} onClick={props.onClick}>
	// 			{attr.title[usedLang]}
	// 		</Link>
	// 	);
}

export default observer(MenuLink);

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;
