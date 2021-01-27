import React, { Component } from "react";

import * as Messages from "../../layout/Messages";
import * as Icon from "react-bootstrap-icons";

import Window, { ButtonsGroup } from "./Window";

export default class DeleteConfirmation extends Component {
	render() {
		return (
			<Window
				className="window"
				title={"Confirm operation"}
				onClose={this.props.onClose}
				disableMaximize={true}
				disableMinimize={true}
			>
				<div className="d-flex flex-row">
					<Icon.Trash size="32px" style={{ margin: "5px" }} />
					<div className="align-center">
						{Messages.getText("FSDeleteConfirm", "en")}
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
							title: "Delete",
							onClick: () => {
								const result = this.props.actions[0](); // TODO:	Niepodoba mi się ta forma wywołania akcji :/
								if (result) this.props.onClose();
							},
						},
						{
							icon: <Icon.X />,
							title: "Cancel",
							onClick: this.props.onClose,
						},
					]}
				/>
			</Window>
		);
	}
}
