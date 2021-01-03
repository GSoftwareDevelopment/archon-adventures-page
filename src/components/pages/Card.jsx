import React, { Component } from "react";
import { db } from "../../libs/db";
import { Collections } from "../../setup";
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

export default class Card extends Component {
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
		const lang = this.state.currentLang;

		let findCondition;
		if (this.props.id) {
			findCondition = { _id: this.props.id };
		} else if (this.props.name) {
			const { path, name } = pathDestructure(this.props.name);
			findCondition = { path, name };
		}

		try {
			await this.fetchCardData(findCondition);

			if (this.state.card) {
				const langs = this.state.card.lang;
				// 1: check for languages count
				if (langs.length > 0) {
					// 2: check for exist currentLang in card
					// if not exist, take first from available
					if (!langs.includes(lang)) {
						this.setState({ langChange: true, currentLang: langs[0] });
					}
				}
			} else {
			}
		} catch (error) {
			console.error(error);
		}
	}

	getAvailableLangs() {
		if (this.state.card) {
			return this.state.card.lang.map((lang) => (
				<span
					key={lang}
					className={lang === this.state.currentLang ? "current" : ""}
				>
					{lang}
				</span>
			));
		} else return null;
	}

	getContentByLang() {
		if (this.state.card) {
			const lang = this.state.currentLang;
			return this.state.card.body[lang];
		} else return "";
	}

	async fetchCardData(find) {
		this.setState({ isReading: true });

		// query the remote DB and update the component state
		const results = await db
			.collection(Collections.CARDS)
			.find(find, { limit: 1 })
			.asArray();

		if (results && results.length !== 0) {
			this.setState({
				card: results[0],
				isReading: false,
			});
		} else {
			console.warn("Content not found. Search parameters: ", find);
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
		return (
			<React.Fragment>
				<ContentLoader busy={this.state.isReading}>
					{/* <div className="card-control">
						<CardEditControl onEdit={this.showEdit} />
		</div> */}
					{this.state.langChange && (
						<div id="lang-warning">
							<IconInfoSquare size="32" />
							<div>
								<p>
									This article is not available in the language of your choice.
								</p>
								<p>
									Language versions available:
									<br />
									{this.getAvailableLangs()}
								</p>
							</div>
						</div>
					)}
					<MarkdownView
						className="markdown"
						markdown={this.getContentByLang()}
						options={showdown_options}
						components={{ Icon }}
					/>
					{/*<ReactMarkdown
						plugins={[[gfm, { tableCellPadding: true, tablePipeAlign: true }]]}
						className="markdown"
						children={this.getContentByLang()}
						linkTarget="_blank"
					/>*/}
					{this.state.isEdit && (
						<CardEdit
							card={this.state.card}
							onUpdate={this.updateContent}
							onClose={this.hideEdit}
						/>
					)}
				</ContentLoader>
			</React.Fragment>
		);
	}
}
