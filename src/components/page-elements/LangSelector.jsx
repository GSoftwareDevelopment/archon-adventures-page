import "./scss/lang-selector.scss";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import * as Messages from "../layout/Messages";
import Flag from "react-flags";

function LangSelector(props) {
	const changeLanguage = (newLang) => {
		LayoutsStore.setCurrentLang(newLang);
		Messages.toConsole(
			"debug.menuRouter.userAction.changeLangPreference",
			newLang
		);
	};

	const currentLayout = LayoutsStore.current;
	const langList = currentLayout.langs;

	const child = (
		<ul>
			{langList.map((langDef) => {
				let langSymbol = langDef.symbol;
				return (
					<li
						key={langSymbol}
						title={langDef.name}
						onClick={() => {
							changeLanguage(langSymbol);
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

	if (props.attr._parentContentType === "router-menu")
		return <li id="lang-selector">{child}</li>;
	else return <nav id="lang-selector">{child}</nav>;
}

export default observer(LangSelector);
