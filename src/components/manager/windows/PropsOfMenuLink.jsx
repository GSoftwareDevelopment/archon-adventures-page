import "../scss/poprsOfMenuLink.scss";
import React, { Component } from "react";
import LayoutsStore, { Status } from "../../../store/layouts";
// import { Collections } from "../../../setup";
// import DropTarget from "../../general/DropTarget";

// import * as Messages from "../../../libs/Messages.js";

import Window, { ButtonsGroup } from "../../general/Window";
import { Save as IconSave } from "react-bootstrap-icons";
import InputML from "../../general/InputML";

class PropsOfMenuLink extends Component {
	state = {
		destRoute: this.props.attr.destRoute || "",
		title: this.props.attr.title || {},
	};

	updateDestRoute(destRoute) {
		this.setState({ destRoute });
	}

	handleRenderItem = (item, attr) => {
		return {
			isChoiced: false,
			item: (
				<React.Fragment>
					<div className="id">{item.id}</div>
					<div className="route">{item.path}</div>
				</React.Fragment>
			),
		};
	};

	render() {
		return (
			<Window
				className="window window-menulink max-height"
				title={"Properties of Menu link"}
				onClose={this.props.onClose}
			>
				<div>
					<label htmlFor="source-path">Destination route:</label>
					<input
						className="hover"
						type="text"
						name="dest-route"
						value={this.state.destRoute}
						onChange={(e) => {
							this.updateDestRoute(e.currentTarget.value);
						}}
					/>
				</div>

				<InputML
					name="title"
					label="Link title"
					currentLang="en"
					langContent={this.state.title}
				>
					<input autoComplete="Off" />
				</InputML>

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

export default PropsOfMenuLink;
