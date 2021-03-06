import React, { Component } from "react";
import { Collections } from "../../../setup";
import { db } from "../../../libs/db";

import LayoutsStore from "../../../store/layouts";
import { languageCheck } from "../../../libs/utils";

import MarkdownView from "react-showdown";
import { showdown_ext, showdown_options } from "./Card-markdown-ext.js";

//

const Status = {
	FETCHING: "fetching",
	DONE: "done",
	ERROR: "error",
};

//

class CalendarEntry extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: Status.FETCHING,
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
				this.setState({ entry, status: Status.DONE });
			}
		} catch (error) {
			console.error(error);
			this.setState({ status: Status.ERROR });
		}
	}

	render() {
		if (this.state.status !== Status.FETCHING) return null;
		if (this.state.status === Status.ERROR) {
			return null;
		}
		const entry = this.state.entry;
		// if (!entry || !entry.publicationDate) return null;
		const _date = entry?.publicationDate
			? entry.publicationDate
			: entry.createdAt;
		const entryDate = _date
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
			.split(" ");

		const titleLangs = [];
		for (const lang in entry.title) titleLangs.push(lang);

		const descLangs = [];
		for (const lang in entry.description) descLangs.push(lang);

		// Messages.toConsole("debug.card.render.bodyLanguages", entryLangs);

		const currentLayout = LayoutsStore.current;
		const defaultLang = currentLayout.defaultLang;
		const currentLang = LayoutsStore.getCurrentLang;

		const usedLangTitle = languageCheck(
			currentLang,
			defaultLang,
			titleLangs,
			(lang) => {
				return entry.title[lang];
			}
		);
		const title = entry.title[usedLangTitle];

		const usedLangDesc = languageCheck(
			currentLang,
			defaultLang,
			descLangs,
			(lang) => {
				return entry.description[lang];
			}
		);
		const description = entry.description[usedLangDesc];

		const show = this.props.show || {
			date: true,
			title: true,
			description: true,
		};
		const showDate = show.date;
		const showTitle = show.title;
		const showDescription = show.description;

		return (
			<div className="calendar">
				<div className="calendar-entry">
					<div>
						{showDate && (
							<div className="date-content">
								{entryDate.map((part, index) => (
									<div key={index}>{part}</div>
								))}
							</div>
						)}
					</div>
					<div className="entry-content">
						{showTitle && <div className="entry-title">{title}</div>}
						{showDescription && (
							<MarkdownView
								className="entry-description markdown"
								markdown={description}
								options={showdown_options}
								components={showdown_ext}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default CalendarEntry;
