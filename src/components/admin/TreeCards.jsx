import React, { Component } from "react";
import { observer } from "mobx-react";
import WindowsStore from "./store/windows";

import { Collections } from "../../setup";

import * as Icon from "react-bootstrap-icons";
import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

import CardEdit from "./windows/CardEdit";

class TreeCards extends Component {
	state = {
		selected: null,
	};

	openCardEdit = (item) => {
		WindowsStore.addWindow(item._id.toString(), CardEdit, item);
		this.props.onOpenWindow();
	};

	openCardNew = ({ path }) => {
		WindowsStore.addWindow("", CardEdit, {
			_id: undefined,
			path,
			name: undefined,
		});
		this.props.onOpenWindow();
	};

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
