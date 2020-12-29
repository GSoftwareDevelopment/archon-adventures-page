import React, { Component } from "react";
import { client, db } from "../../libs/db";
import { Path } from "../../setup";

import { unifyPath, pathDestructure, combinePathName } from "../../libs/utils";

import "./selector.scss";
import * as Icon from "react-bootstrap-icons";
import Alert from "../layout/Alert";
import PulseLoader from "react-spinners/PulseLoader";
import CustomScrollbar from "../layout/CustomScrollbar";
import Window from "../layout/Window";

export class Selector extends Component {
	constructor(props) {
		super(props);
		let { path, name } = pathDestructure(props.filepath);
		if (props.path) path = Path.DELIMITER + unifyPath(props.path);
		this.state = {
			path,
			name,
			paths: [],
			cards: [],
			selectedName: name,
			isReading: false,
			typoAlert: false,
		};
	}

	async componentDidMount() {
		try {
			this.fetchData();
		} catch (error) {
			console.error(error);
		}
	}

	fetchData() {
		this.setState({ isReading: true });
		db.collection(this.props.collection)
			.find({}, null, {
				sort: { name: 1, createdAt: 1 },
			})
			.asArray()
			.then((results) => {
				console.log("Fetched records:", results.length);
				this.setState({
					paths: results
						.map((item) => item.path)
						.filter((v, i, s) => s.indexOf(v) === i) // filter unique entrys
						.sort(),
					cards: results.map((item) => {
						let createdAt = item.createdAt.toISOString().split("T");
						createdAt[1] = createdAt[1].slice(0, 5);
						return {
							_id: item._id,
							path: item.path,
							name: item.name,
							createdAt: createdAt,
						};
					}),
					isReading: false,
				});
			});
	}

	hideTypoAlert = () => {
		this.setState({ typoAlert: false });
	};
	updateFileName = (e) => {
		let name = e.target.value.toString();
		name = name.replace(/[^0-9A-Za-z-]/g, "");

		this.setState({ name, typoAlert: name !== e.target.value });
	};

	changeDir(dir) {
		let _currentPath = unifyPath(this.state.path);
		_currentPath = _currentPath.split(Path.DELIMITER);
		if (_currentPath[0] === "") _currentPath = [];

		dir = dir.trim();
		if (dir !== "..") {
			_currentPath.push(dir);
		} else {
			_currentPath.pop();
		}
		const newPath = Path.DELIMITER + _currentPath.join(Path.DELIMITER);
		this.setState({ path: newPath });
	}

	dirChilds(path) {
		if (this.props.namesOnly) return null;
		if (this.state.paths.length === 0) return null;

		let childs = this.state.paths
			.filter((dir) => dir.slice(0, path.length) === path)
			.map((dir) => unifyPath(dir).split(Path.DELIMITER).pop())
			.filter((v, i, s) => s.indexOf(v) === i) // filter unique entrys
			.sort();

		if (childs[0] !== "") childs[0] = Path.PARENT;
		else childs.shift();

		return childs.map((dir, index) => (
			<li
				key={index}
				className="selector-folder"
				onClick={() => {
					this.changeDir(dir);
				}}
			>
				<Icon.Folder2 size="16" />
				<span className="field-name">{dir}</span>
			</li>
		));
	}

	isSelected(path, name) {
		if (this.props.namesOnly) {
			return name === this.state.selectedName.trim();
		} else {
			const pathname = combinePathName(path, name);
			return pathname === this.state.selectedName.trim();
		}
	}

	doSelect(name) {
		name = name.trim();
		if (name === "") return;

		if (this.props.namesOnly) {
			this.setState({ name: name, selectedName: name });
		} else {
			const pathname = combinePathName(this.state.path, name);
			this.setState({ name: pathname, selectedName: pathname });
		}
	}

	doChoice = (e) => {
		e.preventDefault();

		let name = this.state.name.trim();
		let path = this.state.path;

		if (this.props.namesOnly) {
			this.props.onChoice(name);
		} else {
			const pathname = combinePathName(path, name);
			this.props.onChoice(pathname);
		}
		this.props.onClose();
	};
	render() {
		const currentUser = client.auth.currentUser;
		if (!currentUser || currentUser.loggedInProviderType !== "local-userpass")
			return null;
		else
			return (
				<Window
					className="card-selector"
					title="Selector"
					onClose={this.props.onClose}
				>
					<label htmlFor="card-name">Name:</label>
					<input
						id="card-name"
						type="text"
						value={this.state.name}
						onChange={this.updateFileName}
					/>
					{this.state.typoAlert && (
						<Alert
							className="info left-align"
							variant="error"
							onHide={this.hideTypoAlert}
						>
							You can use only:
							<ul>
								<li>digitts (0-9)</li>
								<li>uppercase and lowercase letters (A-Z, a-z)</li>
								<li>hyphen (-) and underscore (_)</li>
							</ul>{" "}
							Other characters are deleted.
						</Alert>
					)}

					<div className="d-flex flex-column justify-content-start align-items-start">
						<label style={{ alignSelf: "center" }}>
							<Icon.Folder size="16" />
							{this.state.path}
						</label>
						<div className="selector-list">
							<CustomScrollbar>
								<ul>
									<PulseLoader
										size="8px"
										color="#36D7B7"
										loading={this.state.isReading}
									/>
									{this.dirChilds(this.state.path)}
									{this.state.cards.map(
										(item) =>
											item.path === this.state.path && (
												<li
													key={item._id}
													className={
														"selector-item" +
														(this.isSelected(item.path, item.name)
															? " selected"
															: "")
													}
													onClick={() => {
														this.doSelect(item.name);
													}}
												>
													<span className="field-name">{item.name}</span>
													<span className="field-time">
														{item.createdAt[0]}
													</span>
												</li>
											)
									)}
								</ul>
							</CustomScrollbar>
						</div>
					</div>

					<div className="justify-right">
						<button onClick={this.doChoice}>Choice</button>
					</div>
				</Window>
			);
	}
}
