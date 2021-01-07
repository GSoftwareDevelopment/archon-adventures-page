import React, { Component } from "react";
import { useParams, withRouter } from "react-router";
import { Switch, Route, Link } from "react-router-dom";
import LayoutsStore from "../../store/layouts";
import { languageCheck } from "../../libs/utils";
import "./scss/calendar.scss";

import { Path, Paths, Collections } from "../../setup";
import { db } from "../../libs/db";
import Card from "./Card";

// import { CalendarEdit, CalendarEditControl } from "./Calendar-Edit";
import ContentLoader from "../layout/ContentLoader";

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			calendar: [],
			currentCard: null,
			editedCard: null,
			isReading: false,
		};
	}

	async componentDidMount() {
		try {
			await this.fetchCalendarData();
		} catch (error) {
			console.log(error);
		}
	}

	async fetchCalendarData() {
		this.setState({ isReading: true });
		const calendar = await db
			.collection(Collections.CALENDAR)
			.find({ path: this.props.attr.path }, { limit: 100, sort: { date: -1 } })
			.asArray();

		this.setState({ calendar, isReading: false });
	}

	setCard = (card) => {
		this.setState({ currentCard: card });
	};

	// showCreate = () => {
	// 	this.setState({
	// 		editedCard: {
	// 			_id: "",
	// 			date: new Date(),
	// 			title: "",
	// 			description: "",
	// 			cardRefTo: "",
	// 		},
	// 	});
	// };

	// showEdit = (card) => {
	// 	this.setState({ editedCard: card });
	// };

	// hideEdit = () => {
	// 	this.setState({ editedCard: null });
	// };

	// updateEntry = (newEntry) => {
	// 	// debugger;
	// 	const calendar = this.state.calendar;
	// 	let entry = calendar.find((entry) => entry._id === newEntry._id);
	// 	let index = calendar.indexOf(entry);
	// 	this.setState((oldState) => {
	// 		let newState = { ...oldState };
	// 		newState.calendar[index] = newEntry;
	// 		return newState;
	// 	});
	// };

	render() {
		return (
			<React.Fragment>
				<Switch>
					<Route path={`${this.props.match.path}/:cardName`}>
						<CalendarCard matchUrl={this.props.match.url} />
					</Route>
					<Route exact path={this.props.match.path}>
						<ContentLoader busy={this.state.isReading}>
							<CalendarCardsList
								cardList={this.state.calendar}
								matchUrl={this.props.match.url}
								onChoice={this.setCard}
							/>
						</ContentLoader>
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
				.asArray();
			if (entry) {
				this.setState({ entry: entry[0] });
			}
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		const entry = this.state.entry;
		if (!entry || !entry.date) return null;
		const entryDate = entry.date
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

		const defaultLang = LayoutsStore.getDefaultLang();
		const currentLang = LayoutsStore.getCurrentLang();

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
				{this.props.children}
			</div>
		);
	}
}

const CalendarCard = (props) => {
	const { cardName } = useParams();

	return (
		<React.Fragment>
			<CalendarEntry fetchByName={cardName} />
			<Card name={`${Paths.Calendar}${Path.DELIMITER}${cardName}`} />
			<Link className="link" to={props.matchUrl}>
				&lt;&lt;&lt;
			</Link>
		</React.Fragment>
	);
};

export default withRouter(Calendar);
