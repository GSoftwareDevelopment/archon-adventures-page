import React, { Component } from "react";
import { useParams, withRouter } from "react-router";
import { Switch, Route, Link } from "react-router-dom";
import LayoutsStore from "../../store/layouts";
import { languageCheck } from "../../libs/utils";
import "./scss/calendar.scss";

import { Path, Collections } from "../../setup";
import { db } from "../../libs/db";
import Card from "./Card";

import ContentLoader from "../layout/ContentLoader";

import * as Messages from "../layout/Messages";

import MarkdownView from "react-showdown";
import { JournalX as IconJournalX } from "react-bootstrap-icons";

//

const status = {
	FETCHING: "fetching",
	DONE: "done",
	ERROR: "error",
};

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			calendar: [],
			currentCard: null,
			status: status.FETCHING,
		};
	}

	async componentDidMount() {
		try {
			await this.fetchCalendarData();
		} catch (error) {
			Messages.toConsole("fetchingError", error);
			this.setState({
				status: status.ERROR,
			});
		}
	}

	async fetchCalendarData() {
		this.setState({ isReading: true });
		const calendar = await db
			.collection(Collections.CALENDAR)
			.find(
				{ path: this.props.attr.path },
				{ limit: 100, sort: { createdAt: -1 } }
			)
			.asArray();

		this.setState({ calendar, status: status.DONE });
	}

	setCard = (card) => {
		this.setState({ currentCard: card });
	};

	render() {
		if (this.state.status === status.FETCHING)
			return <ContentLoader busy={true} />;

		if (this.state.status === status.ERROR)
			return (
				<div className="warning">
					<IconJournalX size="32" />
					<MarkdownView markdown={Messages.getText("fetchingError", "en")} />
				</div>
			);

		return (
			<React.Fragment>
				<Switch>
					<Route path={`${this.props.match.path}/:cardName`}>
						<CalendarCard
							attr={{ path: this.props.attr.path }}
							matchUrl={this.props.match.url}
						/>
					</Route>
					<Route exact path={this.props.match.path}>
						<CalendarCardsList
							cardList={this.state.calendar}
							matchUrl={this.props.match.url}
							onChoice={this.setCard}
						/>
					</Route>
				</Switch>
			</React.Fragment>
		);
	}
}

const CalendarCardsList = (props) => {
	return (
		<React.Fragment>
			{props.cardList.map((entry, index) => (
				<Link
					key={index + Math.random().toString()}
					className="calendar-link"
					to={`${props.matchUrl}/${entry.cardRefTo}`}
					onClick={() => {
						props.onChoice(entry);
					}}
				>
					<CalendarEntry key={index} entry={entry} />
				</Link>
			))}
		</React.Fragment>
	);
};

export class CalendarEntry extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: status.FETCHING,
			entry: props.entry,
		};
	}

	async componentDidMount() {
		if (!this.props.fetchByName) return;
		const cardName = this.props.fetchByName;
		try {
			const entry = await db
				.collection(Collections.CALENDAR)
				.find({ cardRefTo: cardName }, { limit: 1 })
				.first();
			if (entry) {
				this.setState({ entry, status: status.DONE });
			}
		} catch (error) {
			console.error(error);
			this.setState({ status: status.ERROR });
		}
	}

	render() {
		const entry = this.state.entry;
		if (!entry || !entry.createdAt) return null;
		const entryDate = entry.createdAt
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
			.split(" ");

		const entryLangs = [];
		for (const lang in entry.body) {
			entryLangs.push(lang);
		}
		// Messages.toConsole("debug.card.render.bodyLanguages", entryLangs);

		const currentLayout = LayoutsStore.current;
		const defaultLang = currentLayout.defaultLang;
		const currentLang = LayoutsStore.getCurrentLang;

		const usedLang = languageCheck(
			currentLang,
			defaultLang,
			entryLangs,
			(lang) => {
				return entry.body[lang];
			}
		);

		const title = entry.body[usedLang].title;
		const description = entry.body[usedLang].description;

		return (
			<div className="calendar">
				<div className="calendar-entry">
					<div>
						<div className="date-content">
							{entryDate.map((part, index) => (
								<div key={index}>{part}</div>
							))}
						</div>
					</div>
					<div className="entry-content">
						<div className="entry-title">{title}</div>
						<div className="entry-description">{description}</div>
					</div>
				</div>
			</div>
		);
	}
}

const CalendarCard = (props) => {
	const { cardName } = useParams();

	return (
		<React.Fragment>
			<CalendarEntry fetchByName={cardName} />
			<Card name={`${props.attr.path}${Path.DELIMITER}${cardName}`} />
			<Link className="link" to={props.matchUrl}>
				&lt;&lt;&lt;
			</Link>
		</React.Fragment>
	);
};

export default withRouter(Calendar);
