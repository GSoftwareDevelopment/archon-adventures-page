import "../scss/poprsOfMenuLink.scss";
import React, { Component } from "react";
import LayoutsStore, { Status } from "../../../store/layouts";

import { InputML, ButtonsGroup } from "../../general/Window";
import { Save as IconSave } from "react-bootstrap-icons";

import * as Messages from "../../../libs/Messages";

const msg_base = "props.menuLink";

class PropsOfMenuLink extends Component {
	state = {
		destRoute: this.props.attr.destRoute || "",
		title: this.props.attr.title || {},
	};

	constructor(props) {
		super(props);

		const { dialog } = props;

		dialog({
			className: "window-menulink max-height",
			size: "panel",
			sizeCycle: ["panel", "minimized"],
			disableMaximize: true,
			title: Messages.getText(`${msg_base}.window.title`),
		});
	}

	updateDestRoute(destRoute) {
		this.setState({ destRoute });
	}

	updateTitle = (title) => {
		this.setState({ title });
	};

	save = (e) => {
		e.preventDefault();
		LayoutsStore.updateElementAttr(this.props.attr._id, {
			destRoute: this.state.destRoute,
			title: this.state.title,
		});
	};

	render() {
		return (
			<React.Fragment>
				<div>
					<label htmlFor="source-path">
						{Messages.getText(`${msg_base}.destRoute`)}
					</label>
					<input
						type="text"
						name="dest-route"
						value={this.state.destRoute}
						onChange={(e) => {
							this.updateDestRoute(e.currentTarget.value);
						}}
					/>
				</div>

				<InputML
					name="link-title"
					label={Messages.getText(`${msg_base}.linkTitle`)}
					currentLang="en"
					langContent={this.state.title}
					onUpdate={this.updateTitle}
				>
					<input autoComplete="Off" />
				</InputML>

				<ButtonsGroup
					className="window-footer group-button"
					onlyIcons={false}
					buttons={[
						{
							icon: <IconSave size="1.5em" />,
							title: Messages.getText(`props.save`),
							tip: Messages.getText(`props.save.tip`),
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

export default PropsOfMenuLink;
