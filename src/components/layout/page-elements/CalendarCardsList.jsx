import React from "react";
import { Link } from "react-router-dom";
import CalendarEntry from "./CalendarEntry";

const CalendarCardsList = ({
	cardList,
	activeEntry,
	matchUrl,
	options,
	...props
}) => {
	const view = {
		date: options.view.includes("showDate"),
		title: options.view.includes("showTitle"),
		description: options.view.includes("showDescription"),
	};

	return cardList.map((entry, index) => (
		<ConditionalWrapper
			key={index + Math.random().toString()}
			condition={activeEntry}
			wrapper={(children) => (
				<Link
					className="calendar-link"
					to={`${matchUrl}/${entry.name}`}
					onClick={() => {
						props.onChoice(entry);
					}}
				>
					{children}
				</Link>
			)}
		>
			<CalendarEntry entry={entry} show={view} />
		</ConditionalWrapper>
	));
};

export default CalendarCardsList;

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;
