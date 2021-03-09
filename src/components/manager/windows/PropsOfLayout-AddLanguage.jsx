import React, { Component } from "react";

// import * as Messages from "../../../libs/Messages";
import * as Icon from "react-bootstrap-icons";

import { ButtonsGroup, Input } from "../../general/Window";

export default class AddLanguage extends Component {
	state = {
		symbol: "",
		name: "",
		error: false,
	};

	constructor(props) {
		super(props);

		const { dialog } = props;

		dialog({
			size: "panel",
			sizeCycle: ["panel"],
			title: "Add language",
			disableMaximize: true,
			disableMinimize: true,
		});
	}

	setSymbol = (e) => {
		this.setState({ symbol: e.currentTarget.value });
	};
	setName = (e) => {
		this.setState({ name: e.currentTarget.value });
	};

	onAdd = (e) => {
		this.props.attr.actions[0](this.state); // TODO:	Niepodoba mi się ta forma wywołania akcji :/
		this.props.close();
	};

	isValid() {
		const { symbol, name } = this.state;
		if (
			symbol.trim() === "" ||
			symbol.length > 2 ||
			name.trim() === "" ||
			name.length < 3
		) {
			// this.setState({ error: true });
			return false;
		}

		return true;
	}

	render() {
		return (
			<React.Fragment>
				<Input
					className="hover justify-between"
					noWrapLabel
					inputStyle={{ width: "50px", textAlign: "center" }}
					name="lang_symbol"
					label="Symbol (max. 2 chars)"
					value={this.state.symbol}
					onChange={this.setSymbol}
					autoFocus
				/>
				<Input
					className="hover justify-between"
					noWrapLabel
					name="lang_name"
					label="Name"
					value={this.state.name}
					onChange={this.setName}
				/>
				<ButtonsGroup
					className="window-footer group-button justify-content-end"
					buttons={[
						{
							icon: <Icon.Check2 size="1.5em" />,
							title: "Add",
							onClick: this.onAdd,
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
