import React, { Component } from "react";

// import * as Messages from "../../../libs/Messages";
import * as Icon from "react-bootstrap-icons";

import { ButtonsGroup, Input } from "../../general/Window";

class CalendarEntryPublication extends Component {
	constructor(props) {
		super(props);

		props.dialog({
			size: "panel",
			sizeCycle: ["panel"],
			title: "Publication date",
			disableMaximize: true,
			disableMinimize: true,
		});

		this.state = {
			publicationDate: props.attr.publicationDate.toISOString().split("T")[0],
		};
	}

	updatePublicationDate = (e) => {
		this.setState({ publicationDate: e.currentTarget.value });
	};

	onSave = (e) => {
		this.props.attr.actions[0](new Date(this.state.publicationDate)); // TODO:	Niepodoba mi się ta forma wywołania akcji :/
		this.props.close();
	};

	isValid() {
		return true;
	}

	render() {
		return (
			<React.Fragment>
				<Input
					type="date"
					name="publication-date"
					label="Specify the publication date"
					value={this.state.publicationDate}
					onChange={this.updatePublicationDate}
				/>
				<ButtonsGroup
					className="window-footer group-button justify-content-end"
					buttons={[
						{
							icon: <Icon.Check2 size="1.5em" />,
							title: "OK",
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

export default CalendarEntryPublication;
