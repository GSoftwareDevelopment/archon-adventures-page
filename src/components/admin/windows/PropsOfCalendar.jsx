import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";
import { Collections } from "../../../setup";
import DropTarget from "../DropTarget";
import "../scss/select-list.scss";

import * as Messages from "../../layout/Messages.js";

import Window, { Input, ButtonsGroup } from "./Window";
import { Upload as IconSave, X as IconCancel } from "react-bootstrap-icons";

class PropsOfCalendar extends Component {
	state = {
		sourcePath: this.props.path || "",
		view: [...this.props.options.view],
		pagination: this.props.options.pagination || false,
		limit: this.props.options.limit || 0,
	};

	viewFlags = ["showDate", "showTitle", "showDescription"];

	componentDidMount() {
		LayoutsStore.resetMessage();
	}

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
		LayoutsStore.updateElementAttr(this.props._id, {
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
				className="window"
				title={Messages.getText("props.calendar.window.title")}
				onClose={this.props.onClose}
			>
				<label htmlFor="source-path">
					{Messages.getText("props.calendar.sourcePath")}
				</label>
				<DropTarget onItemDropped={this.dropSourcePath} dropEffect="link">
					<Input
						type="text"
						name="source-path"
						value={this.state.sourcePath}
						onChange={(e) => {
							this.updateSourcePath(e.currentTarget.value);
						}}
					/>
				</DropTarget>
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
						style={{ textAlign: "right", width: "75px" }}
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

				<ButtonsGroup
					className="group-button justify-right"
					style={{ marginBottom: "5px" }}
					onlyIcons={true}
					buttons={[
						{
							component: LayoutsStore.getMessage,
							tip: "Operation result: " + LayoutsStore.getMessage,
							className: "full-width",
							visible: LayoutsStore.getMessage !== "",
						},
						{
							icon: <IconSave />,
							tip: "Save",
							onClick: this.save,
							enabled: LayoutsStore.currentStatus !== Status.SILENT,
							visible:
								LayoutsStore.currentStatus !== Status.WARN &&
								LayoutsStore.getMessage === "",
						},
						{
							icon: <IconCancel />,
							tip: "Cancel",
							onClick: () => {
								LayoutsStore.resetMessage();
							},
							visible: LayoutsStore.getMessage !== "",
						},
					]}
				/>
			</Window>
		);
	}
}

export default observer(PropsOfCalendar);
