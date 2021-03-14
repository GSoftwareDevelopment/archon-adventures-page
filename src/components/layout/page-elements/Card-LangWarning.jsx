import React from "react";

import LayoutsStore from "../../../store/layouts";
import * as Messages from "../../../libs/Messages";

import MarkdownView from "react-showdown";
import { InfoSquare as IconInfoSquare } from "react-bootstrap-icons";

export default function LangWarning({
	cardLangs,
	currentLang,
	onLangChange,
	...props
}) {
	if (!cardLangs || !cardLangs.length === 0) return null;

	const currentLayout = LayoutsStore.current;
	const availableLangs = currentLayout.langs;
	const preferedLang = LayoutsStore.getCurrentLang;

	return (
		<div className="warning">
			<IconInfoSquare size="32" />
			<div>
				<MarkdownView
					markdown={Messages.getText("langWarning", preferedLang)}
				/>
				<p>
					{cardLangs.map((symbol) => {
						const lang = availableLangs.find((lang) => lang.symbol === symbol);

						return (
							<span
								key={lang.symbol}
								className={lang.symbol === currentLang ? "current" : ""}
								onClick={() => {
									onLangChange(lang.symbol);
								}}
							>
								{lang.name}
							</span>
						);
					})}
				</p>
			</div>
		</div>
	);
}
