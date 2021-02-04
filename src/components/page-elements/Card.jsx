import React, { Component } from "react";
import { db } from "../../libs/db";
import { Collections } from "../../setup";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";
import { languageCheck, pathDestructure } from "../../libs/utils";

import "./scss/card.scss";
import * as Messages from "../layout/Messages";

import MarkdownView from "react-showdown";
import { showdown_ext, showdown_options } from "./Card-markdown-ext.js";
import ContentLoader from "../layout/ContentLoader";
import {
	InfoSquare as IconInfoSquare,
	JournalX as IconJournalX,
} from "react-bootstrap-icons";

//

const status = {
	FETCHING: "fetching",
	DONE: "done",
	ERROR: "error",
};

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			card: null,
			choicedLang: "",
			status: status.FETCHING,
		};

		this.fetchCardData = this.fetchCardData.bind(this);
	}

	async componentDidMount() {
		let findCondition;
		if (this.props.id) {
			findCondition = { _id: this.props.id };
		} else if (this.props.name) {
			const { path, name } = pathDestructure(this.props.name);
			findCondition = { path, name };
		}

		try {
			await this.fetchCardData(findCondition);
		} catch (error) {
			Messages.toConsole("fetchingError", error);
			this.setState({
				card: null,
				status: status.ERROR,
				errorMsg: "fetchingError",
			});
		}
	}

	getContentByLang(lang) {
		if (this.state.card) {
			return this.state.card.body[lang];
		} else return "";
	}

	async fetchCardData(find) {
		this.setState({ isReading: true });

		// query the remote DB and update the component state
		const card = await db
			.collection(Collections.CARDS)
			.find(find, { limit: 1 })
			.first();

		if (card && card.length !== 0) {
			this.setState({
				card: card,
				status: status.DONE,
			});
		} else {
			Messages.toConsole("contentDoesNotExist", find);
			this.setState({
				card: null,
				status: status.ERROR,
				errorMsg: "contentDoesNotExist",
			});
		}
	}

	changeLang = (lang) => {
		Messages.toConsole("debug.card.userLangChoice", lang);
	};

	render() {
		if (this.state.status === status.FETCHING)
			return <ContentLoader busy={true} />;
		if (this.state.status === status.ERROR)
			return (
				<div className="warning">
					<IconJournalX size="32" />
					<MarkdownView
						markdown={Messages.getText(this.state.errorMsg, "en")}
					/>
				</div>
			);
		if (!this.state.card) return null;

		const card = this.state.card;

		Messages.toConsole("debug.card.render.open", card.name);

		const cardLangs = [];
		for (const lang in card.body) {
			cardLangs.push(lang);
		}
		Messages.toConsole("debug.card.render.bodyLanguages", cardLangs);

		const currentLayout = LayoutsStore.current;
		const defaultLang = currentLayout.defaultLang;
		const currentLang = LayoutsStore.getCurrentLang;

		let langChange;

		const usedLang = languageCheck(
			currentLang,
			defaultLang,
			cardLangs,
			(lang) => {
				return this.getContentByLang(lang) !== "";
			}
		);

		let content;
		if (usedLang) {
			langChange = usedLang !== currentLang;
			content = this.getContentByLang(usedLang);
			if (langChange) Messages.toConsole("langWarning", usedLang, currentLang);
		} else {
			Messages.toConsole("noLangContext");
			return (
				<div className="warning">
					<IconJournalX size="32" />
					<MarkdownView
						markdown={Messages.getText("noLangContext", currentLang)}
					/>
				</div>
			);
		}

		if (card.options) {
			Messages.toConsole("debug.card.render.optionsModified.open");
			card.options.forEach((option) => {
				if (typeof option === "string") {
					Messages.toConsole(
						"debud.card.render.optionsModfied.flagSet",
						option
					);
					switch (option) {
						case "noLangWarnings":
							langChange = false;
							break;
						default:
							Messages.toConsole(
								"debug.card.render.optionsModified.badOption",
								option
							);
							console.log(`Option '${option}' is not recognized`);
					}
					return;
				}
			});
			Messages.toConsole("debug.card.render.optionsModified.close");
		}

		Messages.toConsole("debug.card.render.close", card.name);

		return (
			<React.Fragment>
				{langChange && (
					<LangWarning
						cardLangs={cardLangs}
						currentLang={usedLang}
						onLangChange={this.changeLang}
					/>
				)}
				<MarkdownView
					key={usedLang}
					className="markdown"
					markdown={content}
					options={showdown_options}
					components={showdown_ext}
				/>
			</React.Fragment>
		);
	}
}

function LangWarning(props) {
	if (!props.cardLangs || !props.cardLangs.length === 0) return null;

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
					{props.cardLangs.map((symbol) => {
						const lang = availableLangs.find((lang) => lang.symbol === symbol);

						return (
							<span
								key={lang.symbol}
								className={lang.symbol === props.currentLang ? "current" : ""}
								onClick={() => {
									props.onLangChange(lang.symbol);
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

export default observer(Card);
