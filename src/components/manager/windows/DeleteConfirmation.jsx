import React, { Component } from "react";

import * as Messages from "../../../libs/Messages";
import * as Icon from "react-bootstrap-icons";

import Window, { ButtonsGroup } from "../../general/Window";

export default class DeleteConfirmation extends Component {
	render() {
		return (
			<Window
				className="window"
				title={Messages.getText("filesystem.deleteConfirm.window.title")}
				onClose={this.props.onClose}
				disableMaximize={true}
				disableMinimize={true}
			>
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
					{this.props.item}
				</div>
				<ButtonsGroup
					className="group-button justify-between"
					style={{ marginBottom: "5px" }}
					buttons={[
						{
							icon: <Icon.Check2 />,
							title: Messages.getText(
								"filesystem.deleteConfirm.buttons.delete"
							),
							onClick: () => {
								const result = this.props.actions[0](); // TODO:	Niepodoba mi się ta forma wywołania akcji :/
								if (result) this.props.onClose();
							},
						},
						{
							icon: <Icon.X />,
							title: Messages.getText(
								"filesystem.deleteConfirm.buttons.cancel"
							),
							onClick: this.props.onClose,
						},
					]}
				/>
			</Window>
		);
	}
}
