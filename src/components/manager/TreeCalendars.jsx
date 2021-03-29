import React, { Component } from "react";
// import LayoutsStore from "../../store/layouts";
import FSStore from "../../store/fs";
import WindowsStore from "../../store/windows";
import { Path, Collections } from "../../setup";
import { ICON_SIZE } from "../general/SidebarMenu";

import {
	CalendarPlus as IconNewEntry,
	PencilSquare as IconEditEntry,
	Trash as IconDelete,
} from "react-bootstrap-icons";
import NodeTree from "../general/NodeTree";
import FileSystemList from "./FileSystemList";
import CalendarEntryEdit from "./windows/CalendarEntryEdit";
import DeleteConfirmation from "./windows/DeleteConfirmation";
import { toast } from "react-toastify";

import * as Messages from "../../libs/Messages";
// import { languageCheck } from "../../libs/utils";
const msg_base = "manager.calendars.options";

export default class TreeCalendars extends Component {
	state = {
		selected: null,
	};

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.updateOptions({ path: Path.DELIMITER, name: null });
			// this.setState({ selected: null });
			// this.props.setOptions([]);
		}
	}

	openCalendarEntryEdit = (item) => {
		WindowsStore.addWindow(
			`calendar-entry-${item._id.toString()}`,
			CalendarEntryEdit,
			item
		);
		// this.props.onOpenWindow();
	};

	openCalendarEntryNew = ({ path }) => {
		const newEntry = {
			_id: undefined,
			path,
			name: "",
		};
		WindowsStore.addWindow("calendar-entry-new", CalendarEntryEdit, newEntry);
		// this.props.onOpenWindow();
	};

	openDeleteConfirm = (item) => {
		const filepath = ""; // combinePathName(item.path, item.name);
		console.log(item);
		WindowsStore.addWindow(
			"delete-" + filepath,
			DeleteConfirmation,
			{
				item: `Calendar entry ${filepath}`,
				actions: [
					// TODO:	Niepodoba mi się ta forma definicji akcji :/
					() => this.doDelete(item),
				],
			},
			"sidebar"
		);
	};

	async doDelete({ _id }) {
		console.log(`Delete entry #${_id}...`);
		try {
			const result = await FSStore.delete({ _id }, Collections.CALENDAR);
			if (result.deletedCount === 1) {
				// this.updateOptions({ path: Path.DELIMITER, name: null });
				toast.success("Entry was deleted.");
			} else {
				console.warn(result);
				toast.dark("Something went wrong!");
			}
		} catch (error) {
			toast.error(error.message);
			console.error(error);
		}
		return true;
	}

	updateOptions = (item) => {
		this.props.setActive();
		this.setState({ selected: item });

		const enabled = item && item.name !== null ? true : false;
		const options = [
			{
				icon: <IconNewEntry size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.newEntry`),
				tip: Messages.getText(`${msg_base}.newEntry.tip`),
				onClick: () => {
					this.openCalendarEntryNew(item);
				},
			},
			{
				icon: <IconEditEntry size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.editEntry`),
				tip: Messages.getText(`${msg_base}.editEntry.tip`),
				onClick: () => {
					this.openCalendarEntryEdit(item.item);
				},
				enabled,
			},
			{
				icon: <IconDelete size={ICON_SIZE} style={{ color: "#F00" }} />,
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
		const createAt = item.createdAt.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		// const titleLangs = [];
		// for (const lang in item.title) titleLangs.push(lang);
		// const currentLayout = LayoutsStore.current;
		// const defaultLang = currentLayout.defaultLang;
		// const currentLang = LayoutsStore.getCurrentLang;

		// const usedLangTitle = languageCheck(
		// 	currentLang,
		// 	defaultLang,
		// 	titleLangs,
		// 	(lang) => {
		// 		return item.title[lang];
		// 	}
		// );

		return (
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
				title={item.name}
			>
				<div
					style={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{item.name /* item.title[usedLangTitle] */}
				</div>
				<div style={{ fontSize: ".8em", whiteSpace: "nowrap" }}>{createAt}</div>
			</div>
		);
	}

	render() {
		return (
			<NodeTree id="calendars-tree" visible={this.props.visible}>
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
			</NodeTree>
		);
	}
}
