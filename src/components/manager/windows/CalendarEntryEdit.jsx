import React, { Component, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
import UsersStore from "../../../store/users";
// import FSStore from "../../../store/fs";

import ContentLoader from "../../layout/ContentLoader";
import { InputPathName, InputML, ButtonsGroup } from "../../general/Window";
import {
	PersonFill as IconUser,
	CalendarEventFill as IconTime,
	Speedometer2 as IconStats,
	Save as IconSave,
	X as IconCancelSave,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
// import CardEdit from "./CardEdit";
// import { correctNameChar } from "../../../libs/utils";

const status = {
	INIT: "init",
	READING: "reading",
	DONE: "done",
	SAVEPROMPT: "saveprompt",
	ERROR: "error",
};

class CalendarEntryEdit extends Component {
	state = {
		status: status.INIT,
		_path: "",
		_name: "",
		currentLang: null,
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
			title: name ? "Calendar entry edit: " + name : "New calendar entry",
		});
	}

	async componentDidMount() {
		const { _id, path, name } = this.props.attr;

		if (_id) {
			// get card data from DB
			try {
				this.entryData = await db
					.collection(Collections.CALENDAR)
					.find({ path, name })
					.first();

				const cardData = await db
					.collection(Collections.CARDS)
					.find({ path, name })
					.first();

				this.entryData.body = cardData.body;
			} catch (error) {
				console.error(error);
				toast.error(error.message);
				this.setState({ status: status.ERROR });
			}
		} else {
			// create card
			this.entryData = {
				path,
				name,
				title: {},
				description: {},
				body: {},
				createdAt: new Date(),
				userId: UsersStore.getCurrentUser().id,
			};
		}
		this.setState({
			title: this.entryData.title,
			description: this.entryData.description,
			body: this.entryData.body,
			_path: path,
			_name: name,
			createdAt: this.entryData.createdAt,
			userInfo: await UsersStore.getOtherUserInfo(this.entryData.userId),
			status: status.DONE,
		});
	}

	setCurrentLang = (lang) => {
		this.setState({ currentLang: lang });
	};

	updateTitle = (title) => {
		this.setState({ title });
	};

	updateDescription = (description) => {
		this.setState({ description });
	};

	updateBody = (body) => {
		this.setState({ body });
	};

	cancelSaveCard = () => {
		this.setState({ status: status.DONE });
	};

	switchToSavePropmt = () => {
		if (this.state.status === status.SAVEPROMPT) {
			// save current card
			this.save();
		} else {
			// show save prompt
			this.setState({ status: status.SAVEPROMPT });
		}
	};

	async save() {
		try {
			const path = this.state._path;
			const name = this.state._name.trim();

			if (name === "") {
				toast.error(`Name filed can't be empty!`);
				return;
			}

			// Make a card from entry data
			const cardData = {
				path,
				name,
				body: this.state.body,
				userId: this.entryData.userId,
				createdAt: this.entryData.createdAt,
			};

			const entryData = {
				path,
				name,
				title: this.state.title,
				description: this.state.description,
				userId: this.entryData.userId,
				createdAt: this.entryData.createdAt,
			};

			console.log(cardData, entryData);
			// Store calendar entry

			// Store card
		} catch (error) {
			toast.error(error.message);
			console.error(error);
			this.setState({ status: status.ERROR });
		}
	}

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
							name="entry-title"
							label="Title"
							currentLang={this.state.currentLang}
							langContent={this.state.title}
							disabled={!isEnabled}
							onUpdate={this.updateTitle}
							onLangChange={this.setCurrentLang}
						>
							<input autoComplete="off" />
						</InputML>
						<InputML
							style={{
								minHeight: "100px",
								height: "100px",
							}}
							name="entry-description"
							label="Description"
							currentLang={this.state.currentLang}
							langContent={this.state.description}
							disabled={!isEnabled}
							onUpdate={this.updateDescription}
							onLangChange={this.setCurrentLang}
						>
							<textarea />
						</InputML>
						<InputML
							style={{
								minHeight: "200px",
								height: "100%",
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

export default observer(CalendarEntryEdit);

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
