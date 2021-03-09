import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";

import { ButtonsGroup, Input, Checkbox } from "../../general/Window";
import { Save as IconSave } from "react-bootstrap-icons";

import * as Messages from "../../../libs/Messages";

const msg_base = "props.routerContent";

class PropsOfRouterContent extends Component {
	state = {
		path: this.props.attr.path || "",
		id: this.props.attr.id || "",
		exact: this.props.attr.exact,
		options: this.props.attr.options || {
			useLayout: "",
		},
	};

	constructor(props) {
		super(props);

		const { dialog } = props;

		dialog({
			className: "max-height",
			size: "panel",
			sizeCycle: ["panel", "minimized"],
			disableMaximize: true,
			title: Messages.getText(`${msg_base}.window.title`),
		});
	}

	updatePath(path) {
		path = path.replace(/(\/)\1/, "/").replace(/[^0-9a-zA-Z-_/]+/g, "-");
		this.setState({ path });
	}

	updateId = (id) => {
		if (id.length === 0) id = "/";
		id = id.replace(/[^0-9a-zA-Z-_]+/g, "-");
		this.setState({ id });
	};

	updateOptions = (e) => {
		e.preventDefault();
		const field = e.currentTarget.name;
		const value = e.currentTarget.value;

		this.setState((oldState) => {
			const newOptions = { ...oldState.options };
			newOptions[field] = value;
			return { options: newOptions };
		});
	};

	save = (e) => {
		e.preventDefault();
		LayoutsStore.updateElementAttr(this.props.attr._id, this.state);
	};

	render() {
		const origin = window.location.origin;
		return (
			<React.Fragment>
				<Input
					className="hover justify-between"
					name="routeId"
					type="text"
					label={Messages.getText(`${msg_base}.routeID`)}
					value={this.state.id}
					onChange={(e) => this.updateId(e.currentTarget.value)}
					noWrapLabel
				/>
				<div className="hover">
					<label htmlFor="source-path">
						{Messages.getText(`${msg_base}.path`)}
					</label>
					<Input
						className="justify-between"
						inputStyle={{ minWidth: "200px" }}
						type="text"
						name="path"
						label={<span style={{ fontStyle: "italic" }}>{origin}</span>}
						value={this.state.path}
						noWrapLabel
						onChange={(e) => this.updatePath(e.currentTarget.value)}
					/>
				</div>
				<Checkbox
					className="hover justify-between"
					name="exact"
					label={Messages.getText(`${msg_base}.exact`)}
					checked={this.state.exact}
					onChange={(e) => this.setState({ exact: e.currentTarget.checked })}
				/>
				<div className="hover justify-between">
					<label htmlFor="useLayout">
						{Messages.getText(`${msg_base}.useLayout`)}
					</label>
					<select
						name="useLayout"
						defaultChecked={this.state.options.useLayout}
						onChange={this.updateOptions}
					>
						<option value="">
							{Messages.getText(`${msg_base}.useLayout.default`)}
						</option>
						<optgroup
							label={Messages.getText(`${msg_base}.useLayout.available`)}
						>
							{LayoutsStore.available.map((layout) => (
								<option key={layout._id} value={layout.name}>
									{layout.name}
								</option>
							))}
						</optgroup>
					</select>
				</div>

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

export default observer(PropsOfRouterContent);
