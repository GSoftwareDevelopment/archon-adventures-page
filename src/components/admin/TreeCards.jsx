import React, { Component } from "react";
import { observer } from "mobx-react";
import WindowsStore from "./store/windows";

import { Collections } from "../../setup";

import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

import CardEdit from "./windows/CardEdit";

class TreeCards extends Component {
	handleCardEdit = (item) => {
		WindowsStore.addWindow(item._id.toString(), CardEdit, item);
		this.props.onOpenWindow();
	};

	render() {
		return (
			<NodeTree id="cards-tree" visible={this.props.visible}>
				<FileSystemList
					collection={Collections.CARDS}
					onDoubleClick={this.handleCardEdit}
				/>
			</NodeTree>
		);
	}
}

export default observer(TreeCards);
