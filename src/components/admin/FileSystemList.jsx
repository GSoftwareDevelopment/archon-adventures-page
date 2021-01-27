import React, { Component } from "react";
import { observer } from "mobx-react";
import FSStore from "./store/fs.js";

import { Path } from "../../setup";
import { unifyPath } from "../../libs/utils";

import Spinner from "react-spinners/DotLoader";
import NodeItem from "./NodeItem";

class FileSystemList extends Component {
	async componentDidMount() {
		await FSStore.updateCollectionFS(this.props.collection);
	}

	render() {
		if (!FSStore.isDone(this.props.collection)) {
			return (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Spinner size="24px" color={"#36D7B7"} loading={true} />
				</div>
			);
		}

		const filesList = FSStore.fileList(this.props.collection);

		return (
			<PathTree
				list={filesList}
				path={Path.DELIMITER}
				renderTitle={this.props.renderTitle}
				selected={this.props.selected}
				onClick={this.props.onClick}
				onDoubleClick={this.props.onDoubleClick}
			/>
		);
	}
}

export default observer(FileSystemList);

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

		if (childs[0] === unifyPath(path)) childs.shift();

		return childs.map((dir, index) => {
			let _currentPath = unifyPath(this.props.path);
			_currentPath = _currentPath.split(Path.DELIMITER);
			if (_currentPath[0] === "") _currentPath = [];

			_currentPath.push(dir);
			const subPath = Path.DELIMITER + _currentPath.join(Path.DELIMITER);

			let selected = { path: null, name: null };
			if (this.props.selected) {
				selected = {
					path: this.props.selected.path,
					name: this.props.selected.name,
				};
			}

			return (
				<NodeItem
					key={index}
					title={dir}
					selected={selected.path === subPath && !selected.name}
					onClick={() => {
						if (this.props.onClick)
							this.props.onClick({ path: subPath, name: null, item: dir });
					}}
				>
					<PathTree
						list={this.props.list}
						path={subPath}
						renderTitle={this.props.renderTitle}
						selected={this.props.selected}
						onClick={this.props.onClick}
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

		let selected = { path: null, name: null };
		if (this.props.selected) {
			selected = {
				path: this.props.selected.path,
				name: this.props.selected.name,
			};
		}

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
							onClick={() => {
								if (this.props.onClick)
									this.props.onClick({
										path: item.path,
										name: item.name,
										item,
									});
							}}
							selected={
								selected.path === item.path && selected.name === item.name
							}
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
