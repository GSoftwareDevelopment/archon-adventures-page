import "./scss/card.scss";

import React, { Component } from "react";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
// import { observer } from "mobx-react";
import LayoutsStore from "../../../store/layouts";
import {
	languageCheck,
	pathDestructure,
	getParamsNames,
	replaceParams,
} from "../../../libs/utils";

import * as Messages from "../../../libs/Messages";

import MarkdownView from "react-showdown";
import { showdown_ext, showdown_options } from "./Card-markdown-ext.js";
import ContentLoader from "../ContentLoader";

import ErrorMessage from "./ErrorMessage";
import LangWarning from "./Card-LangWarning";
import { withRouter } from "react-router";

//

const Status = {
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
			status: Status.FETCHING,
			pathname: "",
		};

		this.fetchCardData = this.fetchCardData.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lang !== this.props.lang) return true;
		if (nextState.card === this.state.card) return false;
		if (
			nextState.status !== this.state.stauts ||
			nextProps.attr._id !== this.props.attr._id ||
			nextProps.name !== this.props.name ||
			nextProps.match.params !== this.props.match.params
		) {
			// console.log(nextProps, nextState);
			return true;
		}
		return false;
	}

	// componentDidUpdate(prevProps) {
	// 	console.log(prevProps, this.props);
	// 	if (
	// 		prevProps.attr._id !== this.props.attr._id ||
	// 		prevProps.name !== this.props.name ||
	// 		prevProps.match.params !== this.props.match.params
	// 	) {
	// 		this.prepareComponent();
	// 		return;
	// 	}
	// 	return false;
	// }

	async componentDidMount() {
		await this.prepareComponent();
	}

	async prepareComponent() {
		try {
			let findCondition = this.prepareFindCondition(this.props);
			if (!findCondition) throw new Error("Find condition not exits!");

			this.setState({ status: Status.FETCHING });
			await this.fetchCardData(findCondition);
		} catch (error) {
			Messages.toConsole("fetchingError", error);
			this.setState({
				card: null,
				status: Status.ERROR,
				errorMsg: "fetchingError",
			});
		}
	}

	prepareFindCondition(props) {
		if (props.id) {
			return { _id: props.id };
		} else if (props.name) {
			let pathname = replaceParams(
				props.name,
				getParamsNames(props.name),
				this.props.match.params
			);

			//
			const { path, name } = pathDestructure(pathname);

			if (name === "") {
				Messages.toConsole("cardPathNameError", { path, name });
				this.setState({
					card: null,
					status: Status.ERROR,
					errorMsg: "cardPathNameError",
				});
				return undefined;
			}
			return { path, name };
		} else {
			Messages.toConsole("cardPathNameError");
			this.setState({
				card: null,
				status: Status.ERROR,
				errorMsg: "cardPathNameError",
			});
			return undefined;
		}
	}

	async fetchCardData(find) {
		// query the remote DB and update the component state
		const card = await db
			.collection(Collections.CARDS)
			.find(find, { limit: 1 })
			.first();

		if (card && card.length !== 0) {
			this.setState({
				card: card,
				status: Status.DONE,
			});
		} else {
			Messages.toConsole("contentDoesNotExist", find);
			this.setState({
				card: null,
				status: Status.ERROR,
				errorMsg: "contentDoesNotExist",
			});
		}
	}

	getContentByLang(lang) {
		if (this.state.card) {
			return this.state.card.body[lang];
		} else return "";
	}

	changeLang = (lang) => {
		Messages.toConsole("debug.card.userLangChoice", lang);
		// TODO: Do zrobienia!
	};

	render() {
		if (this.state.status === Status.FETCHING)
			return <ContentLoader busy={true} />;
		if (this.state.status === Status.ERROR)
			return (
				<ErrorMessage message={Messages.getText(this.state.errorMsg, "en")} />
			);
		if (!this.state.card) return null;

		const { card } = this.state;

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
				<ErrorMessage
					message={Messages.getText("noLangContext", currentLang)}
				/>
			);
		}

		if (this.props.attr?.options) {
			Messages.toConsole("debug.card.render.optionsModified.open");
			this.props.attr.options.forEach((option) => {
				if (typeof option === "string") {
					Messages.toConsole(
						"debug.card.render.optionsModfied.flagSet",
						option
					);
					switch (option) {
						case "noLangWarnings":
							langChange = false;
							break;
						case "useMarkdown":
							break;
						default:
							Messages.toConsole(
								"debug.card.render.optionsModified.badOption",
								option
							);
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

export default withRouter(Card);
