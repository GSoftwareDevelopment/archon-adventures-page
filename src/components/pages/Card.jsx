import React, { Component } from "react";
import { db } from "../../libs/db";
import { Collections } from "../../setup";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import "./card.scss";

import MarkdownView from "react-showdown";
import ContentLoader from "../layout/ContentLoader";
import CardEdit /*, { CardEditControl } */ from "./Card-Edit";
import { pathDestructure } from "../../libs/utils";
import { InfoSquare as IconInfoSquare } from "react-bootstrap-icons";
import * as BSIcon from "react-bootstrap-icons";

// showdown options
const showdown_options = {
	tables: true,
	emoji: true,
	parseImgDimensions: true,
	literalMidWordUnderscores: true,
	strikethrough: true,
	simpleLineBreaks: true,
	openLinksInNewWindow: true,
};

//

function Icon({ ...props }) {
	const BootstrapIcon = BSIcon[props.name];
	if (BootstrapIcon) return <BootstrapIcon {...props} />;
	else return null;
}
//

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			card: null,
			currentLang: props.lang || "",
			content: "",
			isReading: false,
			isEdit: false,
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
			console.error(error);
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
				isReading: false,
			});
		} else {
			console.warn("Content not found for search parameters: ", find);
			this.setState({
				card: null,
				content: `Can't load content. Check console log for more details :(`,
				isReading: false,
			});
		}
	}

	updateContent = (cardData) => {
		this.setState({ card: cardData });
	};

	showEdit = () => {
		this.setState({ isEdit: true });
	};

	hideEdit = () => {
		this.setState({ isEdit: false });
	};

	render() {
		if (this.state.isReading)
			return <ContentLoader busy={this.state.isReading} />;
		if (!this.state.card) return null;

		const cardLangs = this.state.card.lang;

		const defaultLang = LayoutsStore.getDefaultLang();
		let currentLang = LayoutsStore.getCurrentLang();
		console.log("Card ", this.state.card);

		let content = this.getContentByLang(currentLang);
		let langChange = false;
		if (!content) {
			console.log(
				"The content of this card is not defined in the selected language."
			);

			langChange = true;
			if (currentLang !== defaultLang) {
				currentLang = defaultLang;
				content = this.getContentByLang(currentLang);
			}
			if (!content) {
				cardLangs.forEach((lang) => {
					content = this.getContentByLang(lang);
					currentLang = lang;
					if (content) return true;
				});
			}
			if (!content) {
				console.warn("No content found");
				return <div>No content :(</div>;
			}
			console.warn("Language of content was changed to: ", currentLang);
		}
		return (
			<React.Fragment>
				{langChange && (
					<LangWarning cardLangs={cardLangs} currentLang={currentLang} />
				)}
				<MarkdownView
					key={this.state.currentLang}
					className="markdown"
					markdown={content}
					options={showdown_options}
					components={{ Icon }}
				/>
				{this.state.isEdit && (
					<CardEdit
						card={this.state.card}
						onUpdate={this.updateContent}
						onClose={this.hideEdit}
					/>
				)}
			</React.Fragment>
		);
	}
}

function LangWarning(props) {
	if (!props.cardLangs || !props.cardLangs.length === 0) return null;
	const availableLangs = LayoutsStore.getAvailableLang();

	return (
		<div id="lang-warning">
			<IconInfoSquare size="32" />
			<div>
				<p>This article is not available in the language of your choice.</p>
				<p>
					Language versions available:
					<br />
					{props.cardLangs.map((symbol) => {
						const lang = availableLangs.find((lang) => lang.symbol === symbol);

						return (
							<span
								key={lang.symbol}
								className={lang.symbol === props.currentLang ? "current" : ""}
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
