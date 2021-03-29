import React, { Component } from "react";

// import * as Messages from "../../../libs/Messages";
import * as Icon from "react-bootstrap-icons";

import { ButtonsGroup, InputPathName } from "../../general/Window";

class SaveDialog extends Component {
	constructor(props) {
		super(props);

		const { dialog } = props;

		dialog({
			size: "panel",
			sizeCycle: ["panel"],
			title: props.attr.title || "Save",
			disableMaximize: true,
			disableMinimize: true,
		});

		this.state = {
			path: props.attr.path,
			name: props.attr.name,
		};
	}

	onSave = (e) => {
		this.props.attr.actions[0](this.state); // TODO:	Niepodoba mi się ta forma wywołania akcji :/
		this.props.close();
	};

	isValid() {
		const name = this.state.name.trim();
		if (name.length === 0) return false;
		return true;
	}

	render() {
		return (
			<React.Fragment>
				<div className="d-flex align-items-center" style={{ gap: "5px" }}>
					<InputPathName
						path={this.state.path}
						name={this.state.name}
						onChange={({ path, name }) => {
							this.setState({ path, name });
						}}
					/>
				</div>
				<ButtonsGroup
					className="window-footer group-button justify-content-end"
					buttons={[
						{
							icon: <Icon.Check2 size="1.5em" />,
							title: "Save",
							onClick: this.onSave,
							enabled: this.isValid(),
						},
						{
							icon: <Icon.X size="1.5em" />,
							title: "Cancel",
							onClick: this.props.close,
						},
					]}
				/>
			</React.Fragment>
		);
	}
}

export default SaveDialog;
