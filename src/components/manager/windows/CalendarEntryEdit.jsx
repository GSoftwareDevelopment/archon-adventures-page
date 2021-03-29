import "../scss/calendar-entry-edit.scss";

import React, { Component, useEffect, useState } from "react";
import { observer } from "mobx-react";
// import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
import UsersStore from "../../../store/users";
import FSStore from "../../../store/fs";
import WindowsStore from "../../../store/windows";

import ContentLoader from "../../layout/ContentLoader";
import { InputML, ButtonsGroup } from "../../general/Window";
import DropTarget from "../../general/DropTarget";

import {
	PersonFill as IconUser,
	CalendarEventFill as IconTime,
	Speedometer2 as IconStats,
	Save as IconSave,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import SaveDialog from "./SaveDialog";

const Status = {
	INIT: "init",
	READING: "reading",
	DONE: "done",
	WRITING: "writing",
	ERROR: "error",
};

class CalendarEntryEdit extends Component {
	state = {
		status: Status.INIT,
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
				this.entryData = await FSStore.read(
					{ path, name },
					Collections.CALENDAR
				);
				this.cardData = await FSStore.read({ path, name }, Collections.CARDS);
			} catch (error) {
				console.error(error);
				toast.error(error.message);
				this.setState({ status: Status.ERROR });
			}
		} else {
			const createdAt = new Date();
			const userId = UsersStore.getCurrentUser().id;
			// prepare clean calendar entry & card
			this.entryData = {
				_id: null,
				path,
				name,
				isPublished: null,
				publicationDate: createdAt,
				title: {},
				description: {},
				createdAt,
				userId,
			};
			this.cardData = {
				_id: null,
				path,
				name,
				body: {},
				createdAt,
				userId,
			};
		}
		this.setState({
			isPublished: this.entryData.isPublished,
			publicationDate: this.entryData.publicationDate,
			title: this.entryData.title,
			description: this.entryData.description,
			body: this.cardData.body,
			_path: path,
			_name: name,
			createdAt: this.entryData.createdAt,
			userInfo: await UsersStore.getOtherUserInfo(this.entryData.userId),
			status: Status.DONE,
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

	validateForm() {
		const hasValue = (obj) => {
			if (Object.values(obj).length > 0)
				return (
					Object.values(obj)
						.map((text) => text.trim().length)
						.reduce((total, len) => total + len) > 0
				);
			else return 0;
		};

		if (!hasValue(this.state.title)) {
			return `Title must be defined for at least one language.`;
		}
		if (!hasValue(this.state.body)) {
			return `Content must be defined for at least one language.`;
		}

		return true;
	}

	async save({ path, name }) {
		try {
			let errmsg;
			if ((errmsg = this.validateForm()) !== true) throw new Error(errmsg);

			this.setState({ status: Status.WRITING });

			//
			const body = this.state.body;
			const title = this.state.title;
			const description = this.state.description;
			this.cardData = { ...this.cardData, path, name, body };
			this.entryData = { ...this.entryData, path, name, title, description };

			const entryResult = await FSStore.store(
				this.entryData,
				Collections.CALENDAR
			);

			if (entryResult.modifiedCount === 1 || entryResult.insertedId) {
				// if entry was correct created or modified,
				// store a Content body in Cards collection
				const cardResult = await FSStore.store(
					this.cardData,
					Collections.CARDS
				);

				if (cardResult.modifiedCount === 1 || cardResult.insertedId) {
					if (cardResult.modifiedCount === 1) {
						toast.success("Calendar entry correctly saved.");
					} else if (cardResult.insertedId) {
						toast.success("Calendar entry was created.");
					}

					const isPublished =
						this.state.isPublished === null ? false : this.state.isPublished;
					this.setState({ isPublished, status: Status.DONE });
				}
			}
		} catch (error) {
			toast.error(error.message);
			console.error(error);
		}
	}

	// TODO: Trzeba nad tym pomyślec!
	// async handleDropItem(source) {
	// 	try {
	// 		const itemData = JSON.parse(source);
	// 		if (
	// 			typeof itemData === "object" &&
	// 			itemData.src === "filesystem" &&
	// 			itemData.collection === Collections.CARDS
	// 		) {
	// 			const path = itemData.path;
	// 			const name = itemData.name;
	// 			this.cardData = await FSStore.read({ path, name }, Collections.CARDS);
	// 			this.setState({
	// 				body: this.cardData.body,
	// 			});
	// 		}
	// 		//				this.updateSourcePath(combinePathName(itemData.path, itemData.name));
	// 	} catch (error) {
	// 		console.log("Dropped data is not in JSON format");
	// 	}
	// }

	openSaveDialog = (e) => {
		if (e) e.preventDefault();

		let dialogGroup = undefined;
		const _id = this.props.attr._id;
		// determine dialog group
		if (!_id) {
			dialogGroup = "calendar-entry-new";
		} else {
			dialogGroup = `calendar-entry-${_id}`;
		}

		WindowsStore.addWindow(
			"calendar-entry-save-dialog",
			SaveDialog,
			{
				title: "Save",
				path: this.state._path,
				name: this.state._name,
				actions: [
					// TODO:	Niepodoba mi się ta forma definicji akcji :/
					(pathname) => {
						this.save(pathname);
					},
				],
			},
			dialogGroup
		);
	};

	setEntryAsPublished = () => {
		this.setState({ isPublished: true });
	};

	render() {
		const _status = this.state.status;
		const isEnabled = _status === Status.DONE;
		const displayName = this.state.userInfo?.displayName;

		return (
			<React.Fragment>
				<div className="form-wrapper">
					<ContentLoader busy={_status === Status.INIT}>
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
						<DropTarget
							className="input-content-wrapper"
							onItemDropped={(src) => {
								// this.handleDropItem(src);
							}}
							dropEffect="link"
						>
							<InputML
								className="input-component"
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
						</DropTarget>
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
							visible: _status !== Status.INIT,
						},
						{
							component: (
								<CartStats
									content={this.state.body}
									currentLang={this.state.currentLang}
								/>
							),
							visible: _status !== Status.INIT,
						},
					]}
				/>

				<ButtonsGroup
					className="window-footer group-button"
					style={{ alignItems: "flex-end", gap: "5px" }}
					onlyIcons={false}
					buttons={[
						{
							title: "Publish",
							onClick: this.setEntryAsPublished,
							visible:
								_status !== Status.INIT &&
								_status !== Status.WRITING &&
								typeof this.state.isPublished === "boolean" &&
								!Boolean(this.state.isPublished),
						},
						{
							title: "Unpublish",
							onClick: undefined,
							visible:
								_status !== Status.INIT &&
								_status !== Status.WRITING &&
								typeof this.state.isPublished === "boolean" &&
								Boolean(this.state.isPublished),
						},
						{
							icon: <IconSave size="1.5em" />,
							title: "Save",
							onClick: this.openSaveDialog,
							enabled: isEnabled,
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
