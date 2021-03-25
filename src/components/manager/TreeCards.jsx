import React, { Component } from "react";
import { observer } from "mobx-react";
import FSStore from "../../store/fs";
import WindowsStore from "../../store/windows";
import { combinePathName } from "../../libs/utils";
import { Collections, Path } from "../../setup";
import { toast } from "react-toastify";
import { ICON_SIZE } from "../general/SidebarMenu";

import * as Icon from "react-bootstrap-icons";
import NodeTree from "../general/NodeTree";
import FileSystemList from "./FileSystemList";

import CardEdit from "./windows/CardEdit";
import DeleteConfirmation from "./windows/DeleteConfirmation";

import * as Messages from "../../libs/Messages";
const msg_base = "manager.cards.options";

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
		WindowsStore.addWindow(
			"delete-" + filepath,
			DeleteConfirmation,
			{
				item: `Card file ${filepath}`,
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
			const result = await FSStore.delete({ _id }, Collections.CARDS);
			if (result.deletedCount === 1) {
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
				title: Messages.getText(`${msg_base}.newCard`),
				tip: Messages.getText(`${msg_base}.newCard.tip`),
				onClick: () => {
					console.log(item);
					this.openCardNew(item);
				},
			},
			{
				icon: <Icon.PencilSquare size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.editCard`),
				tip: Messages.getText(`${msg_base}.editCard.tip`),
				onClick: () => {
					this.openCardEdit(item.item);
				},
				enabled,
			},
			{
				icon: <Icon.Trash size={ICON_SIZE} style={{ color: "#F00" }} />,
				style: { marginLeft: "auto" },
				title: Messages.getText(`${msg_base}.deleteCard`),
				tip: Messages.getText(`${msg_base}.deleteCard.tip`),
				onClick: () => {
					this.openDeleteConfirm(item.item);
				},
				enabled,
			},
		];
		this.props.setOptions(options);
		// return true;
	};

	render() {
		return (
			<NodeTree id="cards-tree" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<FileSystemList
						collection={Collections.CARDS}
						allowDrag={true}
						allowDragDir={false}
						allowDragFile={true}
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
