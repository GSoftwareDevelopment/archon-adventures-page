import React, { Component } from "react";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
import UsersStore from "../../../store/users";
// import LayoutsStore from "../../../store/layouts";
import FSStore from "../../../store/fs";
import { combinePathName, pathDestructure } from "../../../libs/utils";

import { ButtonsGroup } from "../../general/Window";
import { Save as IconSave, X as IconCancelSave } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import InputML from "../../general/InputML";

const status = {
	INIT: "init",
	READING: "reading",
	DONE: "done",
	SAVEPROMPT: "saveprompt",
	ERROR: "error",
};

export default class CardEdit extends Component {
	state = {
		status: status.INIT,
		lang: [],
		body: {},
		pathfile: "",
		_path: "",
		_file: "",
		prompt: "",
		userInfo: { displayName: "..." },
	};

	constructor(props) {
		super(props);

		const { dialog } = props;
		const { name } = props.attr;

		dialog({
			className: "max-height",
			size: "maximized",
			sizeCycle: ["maximized", "minimized"],
			title: name ? "Edit card: " + name : "New card",
		});
	}

	async componentDidMount() {
		// this.setState({ status: status.READING });
		const { _id, path, name } = this.props.attr;

		if (_id) {
			try {
				const cardData = await db
					.collection(Collections.CARDS)
					.find({ path, name })
					.first();

				this.cardData = cardData;

				this.setState({
					lang: cardData.lang,
					body: cardData.body,
					pathfile: combinePathName(path, name),
					_path: path,
					_name: name,
					status: status.DONE,
					prompt: "",
					createdAt: cardData.createdAt,
					userInfo: await UsersStore.getOtherUserInfo(cardData.userId),
				});
			} catch (error) {
				console.error(error);
				toast.error(error.message);
				this.setState({ status: status.ERROR });
			}
		} else {
			const newCardData = {
				path,
				name,
				body: {},
				lang: [],
				createdAt: new Date(),
				userId: UsersStore.getCurrentUser().id,
			};
			this.cardData = newCardData;

			this.setState({
				lang: newCardData.lang,
				body: newCardData.body,
				pathfile: combinePathName(path, name),
				status: status.DONE,
				createdAt: newCardData.createdAt,
				userInfo: await UsersStore.getOtherUserInfo(newCardData.userId),
				prompt: "",
			});
		}
	}

	updateBody = (body) => {
		this.setState({ body });
	};

	cancelSaveCard = () => {
		this.setState({ status: status.DONE });
	};

	switchToSavePropmt = async () => {
		if (this.state.status === status.SAVEPROMPT) {
			// save current card

			try {
				const { path, name } = pathDestructure(this.state.pathfile);

				if (name === "") throw new Error(`Card name can't be empty!`);

				this.cardData.body = this.state.body;
				this.cardData.lang = this.state.lang;
				this.cardData.path = path;
				this.cardData.name = name;

				let result;
				if (this.cardData._id) {
					// Update card

					result = await db
						.collection(Collections.CARDS)
						.updateOne({ _id: this.cardData._id }, this.cardData);
				} else {
					// Create new card
					result = await db
						.collection(Collections.CARDS)
						.insertOne(this.cardData);
				}

				if (result.modifiedCount === 1) {
					FSStore.updateCollectionFS(Collections.CARDS);
					toast.success("Card correctly saved.");
					this.setState({
						status: status.DONE,
						message: "Card correctly saved",
					});

					// // update fslog
					// const logData={
					// 	type:"modify",
					// 	fsId: this.cardData._id,
					// 	userId: this.cardData.userId,
					// 	timestamp: new Date()
					// };

					// await db.collection(Collections.FSLOG).insertOne(logData);
				} else if (result.insertedId) {
					FSStore.add(this.cardData, Collections.CARDS);
					toast.success("Card was created.");
					this.setState({
						status: status.DONE,
					});
				} else {
					toast.error("Something went wrong");
					this.setState({
						status: status.ERROR,
					});
				}
			} catch (error) {
				toast.error(error.message);
				console.error(error);
				this.setState({ status: status.ERROR });
			}
		} else {
			// show filepath
			this.setState({ status: status.SAVEPROMPT, prompt: "name" });
		}
	};

	render() {
		const isEnabled = this.state.status === status.DONE;
		const displayName = this.state.userInfo?.displayName;

		return (
			<React.Fragment>
				<InputML
					name="card-body"
					label="Content body"
					currentLang="en"
					langContent={this.state.body}
					disabled={!isEnabled}
					onUpdate={this.updateBody}
				>
					<textarea style={{ minHeight: "200px", height: "100%" }} />
				</InputML>
				{this.state.status !== status.INIT && (
					<div
						className="d-flex small"
						style={{ margin: "0 10px", gap: "5px" }}
					>
						<span>{`Created by: ${displayName}`}</span>
						<span>
							{"at "}
							{this.state.createdAt?.toLocaleString()}
						</span>
					</div>
				)}
				<ButtonsGroup
					className="window-footer group-button"
					style={{ marginBottom: "5px" }}
					onlyIcons={false}
					buttons={[
						{
							component: (
								<React.Fragment>
									<div className="d-flex align-items-center">
										<span className="no-wrap">Save as:</span>
										<button
											style={{ marginRight: "5px" }}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ prompt: "path" });
											}}
										>
											{this.state._path}
										</button>
										<input
											className="justify-between"
											type="text"
											name="filepath"
											value={this.state._name}
											autoFocus
											onChange={(e) => {
												this.setState({ _name: e.currentTarget.value });
											}}
										/>
									</div>
								</React.Fragment>
							),
							className: "full-width",
							tip: "File name",
							visible:
								this.state.status === status.SAVEPROMPT &&
								this.state.prompt === "name",
						},
						{
							component: (
								<React.Fragment>
									<div className="d-flex align-items-center">
										<span className="no-wrap">Save as:</span>
										<input
											style={{ marginLeft: "5px" }}
											className="justify-between"
											type="text"
											name="filepath"
											value={this.state._path}
											autoFocus
											onChange={(e) => {
												this.setState({ _path: e.currentTarget.value });
											}}
										/>
										<button
											onClick={(e) => {
												e.preventDefault();
												this.setState({ prompt: "name" });
											}}
										>
											{this.state._name}
										</button>
									</div>
								</React.Fragment>
							),
							className: "full-width",
							tip: "File name",
							visible:
								this.state.status === status.SAVEPROMPT &&
								this.state.prompt === "path",
						},
						{
							icon: <IconSave size="1.5em" />,
							title: "Save",
							onClick: this.switchToSavePropmt,
							enabled: isEnabled || this.state.status === status.SAVEPROMPT,
						},
						{
							icon: <IconCancelSave size="1.5em" />,
							onClick: this.cancelSaveCard,
							visible: this.state.status === status.SAVEPROMPT,
						},
					]}
				/>
			</React.Fragment>
		);
	}
}
