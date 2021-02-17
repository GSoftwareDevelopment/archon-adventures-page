import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";
import { Collections } from "../../../setup";
import DropTarget from "../../general/DropTarget";

import * as Messages from "../../../libs/Messages.js";

import Window, { Input, ButtonsGroup } from "../../general/Window";
import { Save as IconSave } from "react-bootstrap-icons";

class PropsOfCalendar extends Component {
	state = {
		sourcePath: this.props.attr.path || "",
		view: [...this.props.attr.options.view],
		pagination: this.props.attr.options.pagination || false,
		limit: this.props.attr.options.limit || 0,
	};

	viewFlags = ["showDate", "showTitle", "showDescription"];

	updateSourcePath = (newPath) => {
		this.setState({ sourcePath: newPath });
	};

	dropSourcePath = (source) => {
		try {
			const itemData = JSON.parse(source);
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

	save = (e) => {
		e.preventDefault();
		LayoutsStore.updateElementAttr(this.props.attr._id, {
			path: this.state.sourcePath,
			options: {
				pagination: this.state.pagination,
				limit: this.state.limit,
				view: this.state.view,
			},
		});
	};

	render() {
		const currentViewFlags = this.state.view;

		return (
			<Window
				className="window max-height"
				title={Messages.getText("props.calendar.window.title")}
				onClose={this.props.onClose}
			>
				<div>
					<label htmlFor="source-path">
						{Messages.getText("props.calendar.sourcePath")}
					</label>
					<DropTarget onItemDropped={this.dropSourcePath} dropEffect="link">
						<input
							className="hover"
							type="text"
							name="source-path"
							value={this.state.sourcePath}
							onChange={(e) => {
								this.updateSourcePath(e.currentTarget.value);
							}}
						/>
					</DropTarget>
				</div>
				<fieldset>
					<legend>{Messages.getText("props.calendar.attributes")}</legend>
					{this.viewFlags.map((flag) => {
						const isSet = currentViewFlags.includes(flag);
						return (
							<Input
								key={flag}
								className="justify-between hover"
								type="checkbox"
								name={flag}
								label={Messages.getText("props.calendar.attributes." + flag)}
								checked={isSet}
								onChange={(e) => {
									const state = e.currentTarget.checked;
									if (state) {
										if (!currentViewFlags.includes(flag)) {
											currentViewFlags.push(flag);
											this.setState({ view: currentViewFlags });
										}
									} else {
										if (currentViewFlags.includes(flag)) {
											this.setState({
												view: currentViewFlags.filter((f) => f !== flag),
											});
										}
									}
								}}
							/>
						);
					})}

					<Input
						className="justify-between hover"
						type="checkbox"
						name="pagination"
						label={Messages.getText("props.calendar.attributes.pagination")}
						checked={this.state.pagination}
						onChange={(e) => {
							this.setState({ pagination: e.currentTarget.checked });
						}}
					/>
					<Input
						className="justify-between hover"
						inputStyle={{ textAlign: "right", width: "75px" }}
						type="number"
						name="limit"
						min="0"
						noWrapLabel
						label={Messages.getText("props.calendar.attributes.limit")}
						value={this.state.limit}
						onChange={(e) => {
							this.setState({ limit: parseInt(e.currentTarget.value) });
						}}
					/>
				</fieldset>
				<div style={{ flexGrow: "2" }} />
				<ButtonsGroup
					className="window-footer group-button"
					style={{ marginBottom: "5px" }}
					onlyIcons={true}
					buttons={[
						{
							icon: <IconSave size="1.5em" />,
							tip: "Save",
							onClick: this.save,
							enabled:
								LayoutsStore.currentStatus !== Status.SILENT ||
								LayoutsStore.currentStatus === Status.WARN,
						},
					]}
				/>
			</Window>
		);
	}
}

export default observer(PropsOfCalendar);
