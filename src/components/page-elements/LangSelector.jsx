import "./scss/lang-selector.scss";

import LayoutsStore from "../../store/layouts";

import * as Messages from "../layout/Messages";
import Flag from "react-flags";

export default function LangSelector(props) {
	const changeLanguage = (newLang) => {
		LayoutsStore.setCurrentLang(newLang);
		Messages.toConsole(
			"debug.menuRouter.userAction.changeLangPreference",
			newLang
		);
	};

	const langList = LayoutsStore.getAvailableLang();

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