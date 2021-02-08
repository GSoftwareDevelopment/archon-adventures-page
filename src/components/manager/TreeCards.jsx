import React, { Component } from "react";
import { observer } from "mobx-react";
import FSStore from "../../store/fs";
import WindowsStore from "../../store/windows";
import { combinePathName } from "../../libs/utils";
import { db } from "../../libs/db";
import { Collections, Path } from "../../setup";
import { toast } from "react-toastify";
import { ICON_SIZE } from "../general/SidebarMenu";

import * as Icon from "react-bootstrap-icons";
import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

import CardEdit from "./windows/CardEdit";
import DeleteConfirmation from "./windows/DeleteConfirmation";

class TreeCards extends Component {
	state = {
		selected: null,
	};

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.updateOptions({ path: Path.DELIMITER, name: null });
		}
	}

	openCardEdit = (item) => {
		WindowsStore.addWindow(item._id.toString(), CardEdit, item);
		// this.props.onOpenWindow();
	};

	openCardNew = ({ path }) => {
		const newCard = {
			_id: undefined,
			path,
			name: undefined,
		};
		WindowsStore.addWindow("", CardEdit, newCard);
		// this.props.onOpenWindow();
	};

	openDeleteConfirm = (item) => {
		const filepath = combinePathName(item.path, item.name);
		WindowsStore.addWindow("delete-" + filepath, DeleteConfirmation, {
			item: filepath,
			actions: [
				// TODO:	Niepodoba mi się ta forma definicji akcji :/
				() => this.doDelete(item),
			],
		});
	};

	async doDelete({ _id }) {
		console.log(`Delete entry #${_id}...`);
		try {
			const result = await db.collection(Collections.CARDS).deleteOne({ _id });
			if (result.deletedCount === 1) {
				FSStore.remove({ _id }, Collections.CARDS);
				this.updateOptions({ path: Path.DELIMITER, name: null });
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
				icon: <Icon.JournalPlus size={ICON_SIZE} />,
				title: "New",
				onClick: () => {
					console.log(item);
					this.openCardNew(item);
				},
			},
			{
				icon: <Icon.PencilSquare size={ICON_SIZE} />,
				title: "Edit",
				onClick: () => {
					this.openCardEdit(item.item);
				},
				enabled,
			},
			{
				icon: <Icon.Trash size={ICON_SIZE} style={{ color: "#F00" }} />,
				style: { marginLeft: "auto" },
				tip: "Delete",
				onClick: () => {
					this.openDeleteConfirm(item.item);
				},
				enabled,
			},
		];
		this.props.setOptions(options);
		return true;
	};

	render() {
		return (
			<NodeTree id="cards-tree" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<FileSystemList
						collection={Collections.CARDS}
						selected={this.state.selected}
						onClick={this.updateOptions}
						onDoubleClick={this.openCardEdit}
					/>
				</div>
			</NodeTree>
		);
	}
}

export default observer(TreeCards);
