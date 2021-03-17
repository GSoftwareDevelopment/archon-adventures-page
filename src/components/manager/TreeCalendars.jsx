import React, { Component } from "react";
import WindowsStore from "../../store/windows";
import { Collections } from "../../setup";
import { ICON_SIZE } from "../general/SidebarMenu";

import * as Icon from "react-bootstrap-icons";
import NodeTree from "../general/NodeTree";
import FileSystemList from "./FileSystemList";
import CalendarEntryEdit from "./windows/CalendarEntryEdit";

import * as Messages from "../../libs/Messages";
const msg_base = "manager.calendars.options";

export default class TreeCalendars extends Component {
	state = {
		selected: null,
	};

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.setState({ selected: null });
			this.props.setOptions([]);
		}
	}

	openCalendarEntryEdit = (item) => {
		WindowsStore.addWindow(item._id.toString(), CalendarEntryEdit, item);
		// this.props.onOpenWindow();
	};

	openCalendarEntryNew = ({ path }) => {
		const newEntry = {
			_id: undefined,
			path,
			name: "",
		};
		WindowsStore.addWindow("new-calendar-entry", CalendarEntryEdit, newEntry);
		// this.props.onOpenWindow();
	};

	updateOptions = (item) => {
		this.props.setActive();
		this.setState({ selected: item });

		const enabled = item && item.name !== null ? true : false;
		const options = [
			{
				icon: <Icon.JournalPlus size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.newEntry`),
				tip: Messages.getText(`${msg_base}.newEntry.tip`),
				onClick: () => {
					console.log(item);
					this.openCalendarEntryNew(item);
				},
			},
			{
				icon: <Icon.PencilSquare size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.editEntry`),
				tip: Messages.getText(`${msg_base}.editEntry.tip`),
				onClick: () => {
					this.openCalendarEntryEdit(item.item);
				},
				enabled,
			},
			{
				icon: <Icon.Trash size={ICON_SIZE} style={{ color: "#F00" }} />,
				style: { marginLeft: "auto" },
				title: Messages.getText(`${msg_base}.deleteEntry`),
				tip: Messages.getText(`${msg_base}.deleteEntry.tip`),
				onClick: () => {
					this.openDeleteConfirm(item.item);
				},
				enabled,
			},
		];
		this.props.setOptions(options);

		// return true;
	};

	calendarItem(item) {
		const createAt = item.createdAt
			.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
			.split(" ")
			.reverse()
			.join(" ");

		return (
			<React.Fragment>
				<span style={{ fontWeight: "bold" }}>{createAt}</span>
				<div
					style={{
						fontStyle: "italic",
					}}
				>
					{item.name}
				</div>
			</React.Fragment>
		);
	}

	render() {
		return (
			<NodeTree id="calendars-tree" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<FileSystemList
						collection={Collections.CALENDAR}
						allowDrag={true}
						allowDragDir={true}
						allowDragFile={false}
						renderItem={this.calendarItem}
						selected={this.state.selected}
						onClick={this.updateOptions}
						onDoubleClick={this.openCalendarEntryEdit}
					/>
				</div>
			</NodeTree>
		);
	}
}
