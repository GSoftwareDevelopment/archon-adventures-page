import React, { Component } from "react";
import { Collections } from "../../../setup";
import DropTarget from "../DropTarget";
import "../scss/select-list.scss";

import Window, { Input } from "./Window";

export default class PropsOfCalendar extends Component {
	state = {
		sourcePath: "",
	};

	updateSourcePath = (newPath) => {
		this.setState({ sourcePath: newPath });
	};

	dropSourcePath = (source) => {
		try {
			const itemData = JSON.parse(source);
			console.log(itemData);
			if (
				typeof itemData === "object" &&
				itemData.src === "filesystem" &&
				itemData.collection === Collections.CALENDAR
			)
				this.updateSourcePath(itemData.path);
		} catch (error) {
			console.log("Dropped data is not in JSON format");
		}
	};

	render() {
		return (
			<Window
				className="window"
				title="Property of Calendar"
				onClose={this.props.onClose}
			>
				<DropTarget onItemDropped={this.dropSourcePath} dropEffect="link">
					<Input
						type="text"
						name="source-path"
						label="Calendar data source path:"
						value={this.state.sourcePath}
						onChange={(e) => {
							this.this.updateSourcePath(e.currentTarget.value);
						}}
					/>
				</DropTarget>
				<div className="justify-right">
					<button onClick={this.save}>Save</button>
				</div>
			</Window>
		);
	}
}
