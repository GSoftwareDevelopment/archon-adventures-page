import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";
import { Collections } from "../../../setup";
import DropTarget from "../../general/DropTarget";

import * as Messages from "../../../libs/Messages.js";

import { Input, ButtonsGroup, Checkbox } from "../../general/Window";
import { Save as IconSave } from "react-bootstrap-icons";
import { correctPathChar } from "../../../libs/utils";

const msg_base = "props.calendar";

class PropsOfCalendar extends Component {
	state = {
		sourcePath: this.props.attr.path || "",
		view: [...this.props.attr.options.view],
		pagination: this.props.attr.options.pagination || false,
		limit: this.props.attr.options.limit || 0,
	};

	viewFlags = ["showDate", "showTitle", "showDescription"];

	constructor(props) {
		super(props);

		const { dialog } = props;

		dialog({
			className: "max-height",
			size: "panel",
			sizeCycle: ["panel", "minimized"],
			disableMaximize: true,
			title: Messages.getText(`${msg_base}.window.title`),
		});
	}

	updateSourcePath = (newPath) => {
		this.setState({ sourcePath: correctPathChar(newPath) });
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
			<React.Fragment>
				<div className="hover" style={{ margin: "0 5px" }}>
					<label htmlFor="source-path">
						{Messages.getText(`${msg_base}.sourcePath`)}
					</label>
					<DropTarget onItemDropped={this.dropSourcePath} dropEffect="link">
						<input
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
					<legend>
						{Messages.getText(`${msg_base}.attributes.visibleContent`)}
					</legend>
					{this.viewFlags.map((flag) => {
						const isSet = currentViewFlags.includes(flag);
						return (
							<Checkbox
								key={flag}
								className="justify-between hover"
								name={flag}
								label={Messages.getText(
									`${msg_base}.attributes.visibleContent.${flag}`
								)}
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
				</fieldset>
				<fieldset>
					<legend>{Messages.getText(`${msg_base}.attributes`)}</legend>

					<Checkbox
						className="justify-between hover"
						name="pagination"
						label={Messages.getText(`${msg_base}.attributes.pagination`)}
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
						label={Messages.getText(`${msg_base}.attributes.limit`)}
						value={this.state.limit}
						onChange={(e) => {
							this.setState({ limit: parseInt(e.currentTarget.value) });
						}}
					/>
				</fieldset>

				<ButtonsGroup
					className="window-footer group-button"
					onlyIcons={false}
					buttons={[
						{
							icon: <IconSave size="1.5em" />,
							title: Messages.getText(`props.save`),
							tip: Messages.getText(`props.save.tip`),
							onClick: this.save,
							enabled:
								LayoutsStore.currentStatus !== Status.SILENT ||
								LayoutsStore.currentStatus === Status.WARN,
						},
					]}
				/>
			</React.Fragment>
		);
	}
}

export default observer(PropsOfCalendar);
