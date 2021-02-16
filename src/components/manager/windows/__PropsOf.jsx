import React, { Component } from "react";
// import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";
// import { Collections } from "../../../setup";
// import DropTarget from "../../general/DropTarget";

// import * as Messages from "../../../libs/Messages.js";

import Window, { Input, ButtonsGroup } from "../../general/Window";
import { Save2 as IconSave } from "react-bootstrap-icons";

export default class PropsOfMenuLink extends Component {
	render() {
		return (
			<Window
				className="window max-height"
				title={"Properties of Menu link"}
				onClose={this.props.onClose}
			>
				<fieldset style={{ flexGrow: "2" }}>
					<legend>Attributes</legend>
				</fieldset>
				<ButtonsGroup
					className="group-button justify-right"
					style={{ marginBottom: "5px" }}
					onlyIcons={true}
					buttons={[
						{
							icon: <IconSave />,
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
