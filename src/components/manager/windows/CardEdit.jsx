import React, { Component } from "react";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
import LayoutsStore from "../../../store/layouts";
import FSStore from "../../../store/fs";

import Window, { ButtonsGroup, Input } from "../../general/Window";
import { Upload as IconSave, X as IconCancelSave } from "react-bootstrap-icons";
import { combinePathName, pathDestructure } from "../../../libs/utils";
import { toast } from "react-toastify";

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
		editLang: "en",
		lang: [],
		body: [],
		pathfile: "",
	};

	async componentDidMount() {
		this.setState({ status: status.READING });
		const { _id, path, name } = this.props;

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
					status: status.DONE,
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
			};
			this.cardData = newCardData;

			this.setState({
				lang: newCardData.lang,
				body: newCardData.body,
				pathfile: combinePathName(path, name),
				status: status.DONE,
			});
		}
	}

	changeEditLang = (e) => {
		const newEditLang = e.currentTarget.value;
		this.setState({ editLang: newEditLang });
	};

	getContent = (lang) => {
		let ctn = this.state.body[lang] || "";

		return ctn;
	};

	setContent = (e) => {
		const ctn = e.currentTarget.value;
		const body = { ...this.state.body };
		body[this.state.editLang] = ctn;
		this.setState({ body });
	};

	langButtons(currentLang) {
		const layoutLangList = LayoutsStore.current.langs;
		return layoutLangList.map((lang) => {
			const isUsed = this.getContent(lang.symbol).trim() !== "";
			return {
				icon: lang.symbol,
				title: lang.name,
				className: lang.symbol === currentLang ? "active" : "",
				style: { fontWeight: isUsed ? "bold" : "normal" },
				onClick: (e) => {
					this.setState({ editLang: lang.symbol });
				},
				enabled: this.state.status === status.DONE,
			};
		});
	}

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
				if (this.cardData._id)
					result = await db
						.collection(Collections.CARDS)
						.updateOne({ _id: this.cardData._id }, this.cardData);
				else
					result = await db
						.collection(Collections.CARDS)
						.insertOne(this.cardData);

				if (result.modifiedCount === 1) {
					FSStore.updateCollectionFS(Collections.CARDS);
					toast.success("Card correctly saved.");
					this.setState({
						status: status.DONE,
						message: "Card correctly saved",
					});
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
		const editLang = this.state.editLang;
		const isEnabled = this.state.status === status.DONE;
		return (
			<Window
				className="window"
				size="maximized"
				sizeCycle={["maximized", "minimized"]}
				title={this.props.name ? "Edit card: " + this.props.name : "New card"}
				onClose={this.props.onClose}
			>
				<div
					className="d-flex flex-column justify-content-start align-items-start"
					style={{ flexGrow: "2" }}
				>
					<div className="d-flex flex-row justify-content-between align-items-center full-width">
						<label htmlFor="card-body">Body:</label>
						<ButtonsGroup
							className="group-button"
							style={{ marginLeft: "auto" }}
							onlyIcons={true}
							buttons={this.langButtons(editLang)}
						/>
					</div>
					{this.state.status === status.READING ? (
						<div style={{ minHeight: "200px", height: "100%" }}>Loading...</div>
					) : (
						<textarea
							id="card-body"
							value={this.getContent(editLang)}
							disabled={!isEnabled}
							onChange={this.setContent}
						/>
					)}
				</div>

				<ButtonsGroup
					className="group-button justify-right"
					style={{ marginBottom: "5px" }}
					onlyIcons={true}
					buttons={[
						{
							component: (
								<Input
									className="justify-between"
									type="text"
									name="filepath"
									label="Save&nbsp;as:"
									value={this.state.pathfile}
									autoFocus
									onChange={(e) => {
										this.setState({ pathfile: e.currentTarget.value });
									}}
								/>
							),
							className: "full-width",
							tip: "File name with Full path",
							visible: this.state.status === status.SAVEPROMPT,
						},
						{
							icon: <IconSave />,
							tip: "Save",
							onClick: this.switchToSavePropmt,
							enabled: isEnabled || this.state.status === status.SAVEPROMPT,
						},
						{
							icon: <IconCancelSave />,
							onClick: this.cancelSaveCard,
							visible: this.state.status === status.SAVEPROMPT,
						},
					]}
				/>
			</Window>
		);
	}
}