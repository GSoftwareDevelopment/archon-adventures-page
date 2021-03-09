import React, { Component, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
import UsersStore from "../../../store/users";
import FSStore from "../../../store/fs";
import { correctNameChar, correctPathChar } from "../../../libs/utils";

import ContentLoader from "../../layout/ContentLoader";
import { Input, InputML, ButtonsGroup } from "../../general/Window";
import {
	PersonFill as IconUser,
	CalendarEventFill as IconTime,
	Speedometer2 as IconStats,
	Save as IconSave,
	X as IconCancelSave,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

const status = {
	INIT: "init",
	READING: "reading",
	DONE: "done",
	SAVEPROMPT: "saveprompt",
	ERROR: "error",
};

class CardEdit extends Component {
	state = {
		status: status.INIT,
		lang: [],
		body: {},
		_path: "",
		_file: "",
		currentLang: "en",
		userInfo: { displayName: "..." },
	};

	constructor(props) {
		super(props);

		const { dialog } = props;
		const { name } = props.attr;

		dialog({
			className: "full-screen",
			size: "maximized",
			sizeCycle: ["maximized", "minimized"],
			title: name ? "Edit card: " + name : "New card",
		});
	}

	async componentDidMount() {
		// this.setState({ status: status.READING });
		const { _id, path, name } = this.props.attr;

		if (_id) {
			// get card data from DB
			try {
				const cardData = await db
					.collection(Collections.CARDS)
					.find({ path, name })
					.first();

				this.cardData = cardData;

				this.setState({
					lang: cardData.lang,
					body: cardData.body,
					_path: path,
					_name: name,
					status: status.DONE,
					createdAt: cardData.createdAt,
					userInfo: await UsersStore.getOtherUserInfo(cardData.userId),
				});
			} catch (error) {
				console.error(error);
				toast.error(error.message);
				this.setState({ status: status.ERROR });
			}
		} else {
			// create card
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
				_path: path,
				_name: name,
				status: status.DONE,
				createdAt: newCardData.createdAt,
				userInfo: await UsersStore.getOtherUserInfo(newCardData.userId),
			});
		}
	}

	updateBody = (body) => {
		this.setState({ body });
	};

	setCurrentLang = (lang) => {
		this.setState({ currentLang: lang });
	};

	cancelSaveCard = () => {
		this.setState({ status: status.DONE });
	};

	switchToSavePropmt = async () => {
		if (this.state.status === status.SAVEPROMPT) {
			// save current card

			try {
				const path = this.state._path;
				const name = this.state._name.trim();

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
			this.setState({ status: status.SAVEPROMPT });
		}
	};

	render() {
		const isEnabled = this.state.status === status.DONE;
		const displayName = this.state.userInfo?.displayName;

		return (
			<React.Fragment>
				<div
					style={{
						// flexGrow: "2",
						display: "flex",
						flexDirection: "column",

						// width: "100%",
						height: "100%",
						margin: "0 5px",
					}}
				>
					<ContentLoader busy={this.state.status === status.INIT}>
						<InputML
							style={{
								minHeight: "200px",
								height: "100%",
								paddingBottom: "35px",
							}}
							name="card-body"
							label="Content body"
							currentLang={this.state.currentLang}
							langContent={this.state.body}
							disabled={!isEnabled}
							onUpdate={this.updateBody}
							onLangChange={this.setCurrentLang}
						>
							<textarea />
						</InputML>
					</ContentLoader>
				</div>
				<ButtonsGroup
					className="group-button"
					style={{ gap: "5px" }}
					onlyIcons={false}
					buttons={[
						{
							component: (
								<UserInfo name={displayName} time={this.state.createdAt} />
							),
							visible: this.state.status !== status.INIT,
						},
						{
							component: (
								<CartStats
									content={this.state.body}
									currentLang={this.state.currentLang}
								/>
							),
							visible: this.state.status !== status.INIT,
						},
					]}
				/>

				<ButtonsGroup
					className="window-footer group-button"
					style={{ alignItems: "flex-end", gap: "5px" }}
					onlyIcons={false}
					buttons={[
						{
							component: (
								<div
									className="d-flex align-items-center"
									style={{ gap: "5px" }}
								>
									<span className="no-wrap">Save as:</span>
									<InputPathName
										path={this.state._path}
										name={this.state._name}
										onChange={({ path, name }) => {
											this.setState({ _path: path, _name: name });
										}}
									/>
								</div>
							),
							className: "full-width",
							visible: this.state.status === status.SAVEPROMPT,
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

export default observer(CardEdit);

//

function InputPathName({ path, name, onChange, ...props }) {
	const [pathValue, setPathValue] = useState(path);
	const [nameValue, setNameValue] = useState(name);
	const [prompt, setPrompt] = useState("name");

	const switch2PathPrompt = (e) => {
		e.preventDefault();
		setPrompt("path");
	};
	const switch2NamePrompt = (e) => {
		e.preventDefault();
		setPrompt("name");
	};

	return (
		<React.Fragment>
			<Input
				className={"hover" + (prompt === "path" ? " full-width" : "")}
				label="Path:"
				type="text"
				name="path-name"
				value={pathValue}
				onChange={(e) => {
					let { value } = e.currentTarget;
					value = correctPathChar(value);

					setPathValue(value);
					if (onChange) onChange({ path: value, name: nameValue });
				}}
				onFocus={switch2PathPrompt}
			/>
			<Input
				className={"hover" + (prompt === "name" ? " full-width" : "")}
				label="Name:"
				type="text"
				name="file-name"
				value={nameValue}
				autoFocus
				onChange={(e) => {
					let { value } = e.currentTarget;
					value = correctNameChar(value);

					setNameValue(value);
					if (onChange) onChange({ path: pathValue, name: value });
				}}
				onFocus={switch2NamePrompt}
			/>
		</React.Fragment>
	);
}

//

function UserInfo({ name, time }) {
	return (
		<div
			className="d-flex align-items-center small"
			style={{ margin: "0 10px", gap: "5px" }}
		>
			<IconUser />
			<span>{name}</span>
			<IconTime />
			<span>{time?.toLocaleString()}</span>
		</div>
	);
}

//

function CartStats({ content, currentLang, ...props }) {
	const [contentWeight, setContentWeight] = useState(0);
	const [contentWords, setContentWords] = useState(0);

	useEffect(() => {
		if (content && content[currentLang]) {
			let cnt = content[currentLang];
			setContentWeight(cnt.length);
			cnt = cnt
				.replace(/(^\s*)|(\s*$)/gi, "")
				.replace(/[ ]{2,}/gi, " ")
				.replace(/\n /, "\n");
			setContentWords(cnt.split(" ").length);
		}
	}, [content, currentLang, contentWeight, contentWords]);

	return (
		<div className="d-flex align-items-center small" style={{ gap: "5px" }}>
			<IconStats />
			<div>{contentWeight} char(s),</div>
			<div>{contentWords} word(s)</div>
		</div>
	);
}
