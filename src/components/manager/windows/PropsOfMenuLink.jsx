import React, { Component } from "react";
// import { observer } from "mobx-react";
import LayoutsStore, { Status, ContentTypes } from "../../../store/layouts";
// import { Collections } from "../../../setup";
// import DropTarget from "../../general/DropTarget";

// import * as Messages from "../../../libs/Messages.js";

import Window, { Input, ButtonsGroup, SelectList } from "../../general/Window";
import { Save as IconSave } from "react-bootstrap-icons";

export default class PropsOfMenuLink extends Component {
	state = {
		destRoute: this.props.attr.destRoute || "",
	};

	updateDestRoute(destRoute) {
		this.setState({ destRoute });
	}

	handleRenderItem = (item, attr) => {
		return {
			isChoiced: false,
			item: (
				<React.Fragment>
					<div>{item.id}</div>
					<div>{item.path}</div>
				</React.Fragment>
			),
		};
	};

	render() {
		const routes = LayoutsStore.getElementsByContentType(
			ContentTypes.ROUTERCONTENT
		);

		return (
			<Window
				className="window max-height"
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
				<fieldset style={{ flexGrow: "2" }}>
					<legend>Routes defined</legend>
					<SelectList list={routes} onItemRender={this.handleRenderItem} />
				</fieldset>
				<ButtonsGroup
					className="group-button justify-right"
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
