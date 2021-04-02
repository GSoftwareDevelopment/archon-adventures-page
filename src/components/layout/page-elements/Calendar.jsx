import "./scss/calendar.scss";
import React, { Component } from "react";
import { withRouter } from "react-router";
import {
	pathDestructure,
	getParamsNames,
	replaceParams,
} from "../../../libs/utils";
import { Collections } from "../../../setup";
import { db } from "../../../libs/db";
import * as Messages from "../../../libs/Messages";

import ContentLoader from "../ContentLoader";
import ErrorMessage from "./ErrorMessage";
import CalendarCardsList from "./CalendarCardsList";

// import MarkdownView from "react-showdown";

//

const Status = {
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
			status: Status.FETCHING,
		};
	}

	async componentDidMount() {
		await this.prepareComponent();
	}

	prepareFindCondition(props) {
		if (props.attr.path) {
			let pathname = replaceParams(
				props.attr.path,
				getParamsNames(props.attr.path),
				this.props.match.params
			);

			//
			const { path, name } = pathDestructure(pathname);
			if (name) {
				return { path, name };
			} else {
				return { path };
			}
		}
	}

	async prepareComponent() {
		try {
			let findCondition = this.prepareFindCondition(this.props);
			if (!findCondition) throw new Error("Find condition not exits!");

			this.setState({ status: Status.FETCHING });
			await this.fetchCalendarData(
				{
					...findCondition,
					isPublished: { $eq: true },
					publicationDate: { $lte: new Date() },
				},
				this.props.attr.options.limit
			);
		} catch (error) {
			Messages.toConsole("fetchingError", error);
			this.setState({
				status: Status.ERROR,
			});
		}
	}

	async fetchCalendarData(find, limit = 0) {
		const calendar = await db
			.collection(Collections.CALENDAR)
			.find(
				find, // { path: this.props.attr.path },
				{ limit, sort: { publicationDate: -1 } }
			)
			.asArray();

		console.log(
			`Calendar at ${this.props.attr.path}. Found: ${calendar.length} elements`
		);

		if (calendar.length === 0) {
			this.setState({ status: Status.ERROR });
		} else {
			this.setState({ calendar, status: Status.DONE });
		}
	}

	setCard = (card) => {
		this.setState({ currentCard: card });
	};

	render() {
		if (this.state.status === Status.FETCHING)
			return <ContentLoader busy={true} />;

		if (this.state.status === Status.ERROR)
			return <ErrorMessage message={Messages.getText("fetchingError")} />;

		return (
			<CalendarCardsList
				cardList={this.state.calendar}
				options={this.props.attr.options}
				activeEntry={this.props.attr.active}
				matchUrl={this.props.attr.redirectTo || this.props.match.url}
				onChoice={this.setCard}
			/>
		);
	}
}

export default withRouter(Calendar);
