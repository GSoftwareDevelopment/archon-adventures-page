import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";

import { ButtonsGroup } from "../../general/Window";
import { Save2 as IconSave } from "react-bootstrap-icons";

class PropsOf extends Component {
	constructor(props) {
		super(props);

		const { dialog } = props;
		dialog({
			className: " window-add-element max-height",
			size: "panel",
			sizeCycle: ["maximized", "panel"],
			title: ``,
		});
	}

	save = () => {};

	render() {
		return (
			<React.Fragment>
				<div style={{ flexGrow: "2" }} />
				<ButtonsGroup
					className="group-button justify-right"
					style={{ marginBottom: "5px" }}
					onlyIcons={false}
					buttons={[
						{
							icon: <IconSave size="1.5em" />,
							title: "Save",
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

export default observer(PropsOf);
