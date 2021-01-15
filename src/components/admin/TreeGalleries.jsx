import React, { Component } from "react";

import { Collections } from "../../setup";

import NodeTree from "./NodeTree";
import FileSystemList from "./FileSystemList";

export default class TreeGalleries extends Component {
	render() {
		return (
			<NodeTree id="galleries-tree" visible={this.props.visible}>
				<FileSystemList
					collection={Collections.GALLERIES}
					onDoubleClick={(item) => {
						console.log(item);
					}}
				/>
			</NodeTree>
		);
	}
}
