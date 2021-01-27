import React, { Component } from "react";
import { observer } from "mobx-react";
import FSStore from "./store/fs";
import WindowsStore from "./store/windows";
import { combinePathName } from "../../libs/utils";
import { db } from "../../libs/db";
import { Collections } from "../../setup";

import * as Icon from "react-bootstrap-icons";
import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

import CardEdit from "./windows/CardEdit";
import DeleteConfirmation from "./windows/DeleteConfirmation";

class TreeCards extends Component {
	state = {
		selected: null,
	};

	openCardEdit = (item) => {
		WindowsStore.addWindow(item._id.toString(), CardEdit, item);
		this.props.onOpenWindow();
	};

	openCardNew = ({ path }) => {
		const newCard = {
			_id: undefined,
			path,
			name: undefined,
		};
		WindowsStore.addWindow("", CardEdit, newCard);
		this.props.onOpenWindow();
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
			}
		} catch (error) {
			console.error(error);
		}
		return true;
	}

	render() {
		return (
			<NodeTree id="cards-tree" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<FileSystemList
						collection={Collections.CARDS}
						selected={this.state.selected}
						onClick={(item) => {
							this.setState({ selected: item });
							this.props.setOptions([
								{
									icon: <Icon.JournalPlus size="20px" />,
									title: "New",
									onClick: () => {
										console.log(item);
										this.openCardNew(item);
									},
								},
								{
									icon: <Icon.PencilSquare size="20px" />,
									title: "Edit",
									onClick: () => {
										this.openCardEdit(item.item);
									},
									enabled: item.name !== null,
								},
								{
									icon: <Icon.Trash size="20px" style={{ color: "#F00" }} />,
									style: { marginLeft: "auto" },
									title: "Delete",
									onClick: () => {
										this.openDeleteConfirm(item.item);
									},
									enabled: item.name !== null,
								},
							]);
						}}
						onDoubleClick={this.openCardEdit}
					/>
				</div>
			</NodeTree>
		);
	}
}

export default observer(TreeCards);
