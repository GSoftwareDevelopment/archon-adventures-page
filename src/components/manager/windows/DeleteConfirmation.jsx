import React, { Component } from "react";

import * as Messages from "../../../libs/Messages";
import * as Icon from "react-bootstrap-icons";

import { ButtonsGroup } from "../../general/Window";

export default class DeleteConfirmation extends Component {
	constructor(props) {
		super(props);

		const { dialog } = props;

		dialog({
			size: "panel",
			sizeCycle: ["panel"],
			title: Messages.getText("filesystem.deleteConfirm.window.title"),
			disableMaximize: true,
			disableMinimize: true,
		});
	}
	render() {
		return (
			<React.Fragment>
				<div className="d-flex flex-row">
					<Icon.Trash size="32px" style={{ margin: "5px" }} />
					<div className="align-center">
						{Messages.getTextAsMarkdown("filesystem.deleteConfirm")}
					</div>
				</div>
				<div
					className="align-center"
					style={{ fontWeight: "bold", margin: "5px 0" }}
				>
					{this.props.attr.item}
				</div>
				<ButtonsGroup
					className="window-footer group-button"
					buttons={[
						{
							icon: <Icon.Check2 size="1.5em" />,
							title: Messages.getText(
								"filesystem.deleteConfirm.buttons.delete"
							),
							onClick: () => {
								const result = this.props.attr.actions[0](); // TODO:	Niepodoba mi się ta forma wywołania akcji :/
								if (result) this.props.close();
							},
						},
						{
							icon: <Icon.X size="1.5em" />,
							title: Messages.getText(
								"filesystem.deleteConfirm.buttons.cancel"
							),
							onClick: this.props.close,
						},
					]}
				/>
			</React.Fragment>
		);
	}
}
