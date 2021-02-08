import React, { Component } from "react";

import { Collections } from "../../setup";

import NodeTree from "../general/NodeTree";
import FileSystemList from "./FileSystemList";

export default class TreeGalleries extends Component {
	render() {
		return (
			<NodeTree id="galleries-tree" visible={this.props.visible}>
				<div style={{ flexGrow: "2" }}>
					<FileSystemList
						collection={Collections.GALLERIES}
						onDoubleClick={(item) => {
							console.log(item);
						}}
					/>
				</div>
			</NodeTree>
		);
	}
}
