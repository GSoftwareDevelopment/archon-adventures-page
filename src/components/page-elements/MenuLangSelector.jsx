import LayoutsStore from "../../store/layouts";

import * as Messages from "../layout/Messages";
import Flag from "react-flags";

export default function MenuLangSelector(props) {
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
		return <li className="lang-selector">{child}</li>;
	else return <div className="lang-selector">{child}</div>;
}
