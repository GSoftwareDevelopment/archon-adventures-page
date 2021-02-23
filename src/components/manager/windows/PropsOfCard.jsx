import React, { Component } from "react";
import LayoutsStore, { Status } from "../../../store/layouts";
import { Collections } from "../../../setup";

import * as Messages from "../../../libs/Messages.js";

import { Input, ButtonsGroup } from "../../general/Window";
import { Save2 as IconSave } from "react-bootstrap-icons";
import DropTarget from "../../general/DropTarget";
import { combinePathName } from "../../../libs/utils";

const msg_base = "props.card";

export default class PropsOfCard extends Component {
	state = {
		sourcePath: this.props.attr.name || "",
		options: [...this.props.attr.options],
	};

	optionsFlags = [
		"noLangWarnings",
		"useMarkdown",
		"allowUserComments",
		"allowAnonimousComments",
	];

	constructor(props) {
		super(props);

		const { dialog } = props;
		dialog({
			className: " window-add-element max-height",
			size: "panel",
			sizeCycle: ["panel", "minimized"],
			title: Messages.getText(`${msg_base}.window.title`),
		});
	}

	updateSourcePath = (newPath) => {
		this.setState({ sourcePath: newPath });
	};

	dropSourcePath = (source) => {
		debugger;
		try {
			const itemData = JSON.parse(source);
			if (
				typeof itemData === "object" &&
				itemData.src === "filesystem" &&
				itemData.collection === Collections.CARDS
			)
				this.updateSourcePath(combinePathName(itemData.path, itemData.name));
		} catch (error) {
			console.log("Dropped data is not in JSON format");
		}
	};

	save = () => {};

	render() {
		const currentOptionsFlags = this.state.options;

		return (
			<React.Fragment>
				<div>
					<label htmlFor="source-filepath">
						{Messages.getText(`${msg_base}.sourceFilePath`)}
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
					<legend>{Messages.getText(`${msg_base}.attributes`)}</legend>
					{this.optionsFlags.map((flag) => {
						const isSet = currentOptionsFlags.includes(flag);
						return (
							<Input
								key={flag}
								className="justify-between hover"
								type="checkbox"
								name={flag}
								label={Messages.getText(`${msg_base}.attributes.${flag}`)}
								checked={isSet}
								onChange={(e) => {
									const state = e.currentTarget.checked;
									if (state) {
										if (!currentOptionsFlags.includes(flag)) {
											currentOptionsFlags.push(flag);
											this.setState({ options: currentOptionsFlags });
										}
									} else {
										if (currentOptionsFlags.includes(flag)) {
											this.setState({
												options: currentOptionsFlags.filter((f) => f !== flag),
											});
										}
									}
								}}
							/>
						);
					})}
				</fieldset>

				<ButtonsGroup
					className="window-footer group-button"
					style={{ marginBottom: "5px", marginTop: "auto" }}
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
