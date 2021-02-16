import "./scss/lang-selector.scss";
import { observer } from "mobx-react";
import LayoutsStore from "../../../store/layouts";

import * as Messages from "../../../libs/Messages";
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

	return (
		<ConditionalWrapper
			condition={props.attr._parentContentType === "router-menu"}
			wrapperTrue={(children) => <li id="lang-selector">{children}</li>}
			wrapperFalse={(children) => <nav id="lang-selector">{children}</nav>}
		>
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
		</ConditionalWrapper>
	);
}

export default observer(LangSelector);

const ConditionalWrapper = ({
	condition,
	wrapperTrue,
	wrapperFalse,
	children,
}) => (condition ? wrapperTrue(children) : wrapperFalse(children));
