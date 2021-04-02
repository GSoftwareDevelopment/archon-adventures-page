import React, { Component } from "react";
import { observer } from "mobx-react";
import FSStore from "../../store/fs.js";
// import UsersStore from "../../store/users.js";

import { Path } from "../../setup";
import {
	unifyPath,
	sortFileByCreatedAtDesc,
	// sortFileByCreatedAtAsc,
} from "../../libs/utils";

import Spinner from "react-spinners/BarLoader";
import NodeItem from "./NodeItem";

class FileSystemList extends Component {
	async componentDidMount() {
		await FSStore.updateCollectionFS(this.props.collection);
	}

	render() {
		let filesList = FSStore.fileList(this.props.collection).sort(
			sortFileByCreatedAtDesc
		);
		return (
			<React.Fragment>
				{!FSStore.isDone(this.props.collection) && (
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Spinner size="24px" color={"#36D7B7"} loading={true} />
					</div>
				)}
				<PathTree {...this.props} list={filesList} path={Path.DELIMITER} />
			</React.Fragment>
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

	shouldComponentUpdate(nextProps) {
		return nextProps.list !== this.props.list;
	}

	componentDidUpdate() {
		const props = this.props;
		this.setState({
			paths: props.list
				.map((item) => item.path)
				.filter((v, i, s) => s.indexOf(v) === i) // filter unique entrys
				.sort()
				.filter((item) => item.slice(0, props.path.length) === props.path),
		});
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
					className="node-collection"
					title={dir}
					selected={selected.path === subPath && !selected.name}
					allowDrag={this.props.allowDrag && this.props.allowDragDir}
					dragData={JSON.stringify({
						src: "filesystem",
						path: subPath,
						name: null,
						collection: this.props.collection,
					})}
					onClick={() => {
						if (this.props.onClick)
							return this.props.onClick({
								path: subPath,
								name: null,
								item: dir,
							});
					}}
				>
					<PathTree {...this.props} path={subPath} />
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
				{!this.props.onlySubDirs &&
					list.map((item, index) => {
						let title = item.name;

						if (this.props.renderItem) {
							title = this.props.renderItem(item);
						}

						return (
							<NodeItem
								key={index}
								className="node-collection"
								title={title}
								allowDrag={this.props.allowDrag && this.props.allowDragFile}
								dragData={JSON.stringify({
									src: "filesystem",
									path: item.path,
									name: item.name,
									collection: this.props.collection,
								})}
								onClick={() => {
									if (this.props.onClick)
										return this.props.onClick({
											path: item.path,
											name: item.name,
											item,
										});
								}}
								selected={
									// TODO: Zmień sposób sprawdzania wybrnego elementu!! po ID
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
