import React, { Component, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Collections } from "../../../setup";
import UsersStore from "../../../store/users";
import FSStore from "../../../store/fs";

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
		_name: "",
		currentLang: null,
		userInfo: { displayName: "..." },
	};

	constructor(props) {
		super(props);

		if (props.dialog) {
			const { name } = props.attr;
			props.dialog({
				className: "full-screen",
				size: "maximized",
				sizeCycle: ["maximized", "minimized"],
				title: name ? "Edit card: " + name : "New card",
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props?.currentLang !== prevProps?.currentLang) {
			this.setCurrentLang(this.props.currentLang);
		}
		if (this.props.attr.name !== prevProps.attr.name) {
			this.setState({ _name: this.props.attr.name });
		}
	}

	async componentDidMount() {
		// this.setState({ status: status.READING });
		const { _id, path, name } = this.props.attr;
		let data = {};

		if (_id) {
			// get card data from DB
			try {
				data = await FSStore.read({ path, name }, Collections.CARDS);
			} catch (error) {
				console.error(error);
				toast.error(error.message);
				this.setState({ status: status.ERROR });
			}
		} else {
			// create card
			data = {
				path,
				name,
				body: {},
				lang: [],
				createdAt: new Date(),
				userId: UsersStore.getCurrentUser().id,
			};
		}
		this.cardData = data;
		this.setState({
			lang: data.lang,
			body: data.body,
			_path: path,
			_name: name,
			status: status.DONE,
			createdAt: data.createdAt,
			userInfo: await UsersStore.getOtherUserInfo(data.userId),
		});
	}

	updateBody = (body) => {
		this.setState({ body });
	};

	setCurrentLang = (lang) => {
		this.setState({ currentLang: lang });
		// if (this.props.onLangChange) this.props.onLangChange(lang);
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
				toast.error(`Name filed cant be empty!`);
				return;
			}

			this.cardData = { ...this.cardData, path, name, body: this.state.body };

			const result = await FSStore.store(this.cardData, Collections.CARDS);

			if (result.modifiedCount === 1) {
				toast.success("Card correctly saved.");
				this.setState({ status: status.DONE });
				if (this.props.dialog)
					this.props.dialog({
						title: name ? "Edit card: " + name : "New card",
					});
			} else if (result.insertedId) {
				toast.success("Card was created.");
				this.setState({ status: status.DONE });
				if (this.props.dialog)
					this.props.dialog({
						title: name ? "Edit card: " + name : "New card",
					});
			} else {
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error(error.message);
			console.error(error);
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
							style={{
								minHeight: "200px",
								height: "100%",
								// paddingBottom: "35px",
							}}
							hideLangButtons={this.props.hideLangButtons}
							name="card-body"
							label="Content body"
							disabled={!isEnabled}
							currentLang={this.state.currentLang}
							langContent={this.state.body}
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

export default observer(CardEdit);

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
