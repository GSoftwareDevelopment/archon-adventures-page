import React, { Component } from "react";

import { db } from "../../libs/db";
import { Path } from "../../setup";
import { unifyPath } from "../../libs/utils";

import Spinner from "react-spinners/DotLoader";
import NodeItem from "./NodeItem";

const status = {
	INIT: "init",
	PENDING: "pending",
	ERROR: "error",
	DONE: "DONE",
};

export default class FileSystemList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: status.INIT,
			files: [],
		};
	}

	async componentDidMount() {
		console.log("> Pending data about '" + this.props.collection + "'...");
		this.setState({ status: status.PENDING });
		try {
			const files = await db
				.collection(this.props.collection)
				.find(
					{},
					{
						projection: { name: 1, path: 1, createdAt: 1 },
						sort: { path: 1, name: 1 },
					}
				)
				.asArray();

			this.setState({ files, status: status.DONE });
		} catch (error) {
			console.error(error);
			this.setState({ status: status.ERROR });
		}
	}

	render() {
		if (this.state.status === status.PENDING)
			return (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Spinner size="24px" color={"#36D7B7"} loading={true} />
				</div>
			);
		if (this.state.status !== status.DONE) return null;

		return (
			<PathTree
				list={this.state.files}
				path={Path.DELIMITER}
				renderTitle={this.props.renderTitle}
				onDoubleClick={this.props.onDoubleClick}
			/>
		);
	}
}

//

class PathTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			paths: props.list
				.map((item) => item.path)
				.filter((v, i, s) => s.indexOf(v) === i) // filter unique entrys
				.sort()
				.filter((item) => item.slice(0, props.path.length) === props.path),
		};
	}

	subPaths(path) {
		if (this.state.paths.length === 0) return null;

		let childs = this.state.paths
			.map((dir) => unifyPath(dir).split(Path.DELIMITER).pop())
			.filter((v, i, s) => s.indexOf(v) === i) // filter unique entrys
			.sort();

		// debugger;
		if (childs[0] === unifyPath(path)) childs.shift();

		return childs.map((dir, index) => {
			let _currentPath = unifyPath(this.props.path);
			_currentPath = _currentPath.split(Path.DELIMITER);
			if (_currentPath[0] === "") _currentPath = [];

			_currentPath.push(dir);
			const subPath = Path.DELIMITER + _currentPath.join(Path.DELIMITER);

			return (
				<NodeItem key={index} title={dir} haveChildrens={true}>
					<PathTree
						list={this.props.list}
						path={subPath}
						renderTitle={this.props.renderTitle}
						onDoubleClick={this.props.onDoubleClick}
					/>
				</NodeItem>
			);
		});
	}

	render() {
		const list = this.props.list.filter(
			(item) => item.path === this.props.path
		);

		return (
			<React.Fragment>
				{this.subPaths(this.props.path)}
				{list.map((item, index) => {
					let title = item.name;

					if (this.props.renderTitle) {
						title = this.props.renderTitle(item);
					}

					return (
						<NodeItem
							key={index}
							title={title}
							haveChildrends={false}
							onDoubleClick={() => {
								if (this.props.onDoubleClick) this.props.onDoubleClick(item);
							}}
						/>
					);
				})}
			</React.Fragment>
		);
	}
}
