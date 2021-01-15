import React, { Component } from "react";
import { Collections } from "../../setup";

import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

export default class TreeCalendars extends Component {
	calendarIten(item) {
		const title = item.createdAt
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
			.split(" ")
			.reverse()
			.join(" ");

		return title + " - " + item.name;
	}

	render() {
		return (
			<NodeTree id="calendars-tree" visible={this.props.visible}>
				<FileSystemList
					collection={Collections.CALENDAR}
					renderItem={this.calendarIten}
					onDoubleClick={(item) => {
						console.log(item);
					}}
				/>
			</NodeTree>
		);
	}
}
