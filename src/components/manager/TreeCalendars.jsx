import React, { Component } from "react";
import { Collections } from "../../setup";

import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

export default class TreeCalendars extends Component {
	calendarItem(item) {
		const createAt = item.createdAt
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
			.split(" ")
			.reverse()
			.join(" ");

		return (
			<React.Fragment>
				<span style={{ fontWeight: "bold" }}>{createAt}</span>
				<div
					style={{
						fontStyle: "italic",
					}}
				>
					{item.name}
				</div>
			</React.Fragment>
		);
	}

	render() {
		return (
			<NodeTree id="calendars-tree" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<FileSystemList
						collection={Collections.CALENDAR}
						allowDrag={true}
						allowDragDir={true}
						allowDragFile={false}
						renderItem={this.calendarItem}
						onClick={(item) => {
							console.log(item);
							return true;
						}}
						onDoubleClick={(item) => {
							console.log(item);
						}}
					/>
				</div>
			</NodeTree>
		);
	}
}
