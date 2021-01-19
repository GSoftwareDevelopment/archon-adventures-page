import React, { Component } from "react";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";
import LayoutsStore from "../store/layouts";

import Window from "./Window";

const status = {
	INIT: "init",
	READING: "reading",
	DONE: "done",
	ERROR: "error",
};

export default class CardEdit extends Component {
	state = {
		status: status.INIT,
		editLang: "en",
		lang: [],
		body: [],
	};

	async componentDidMount() {
		this.setState({ status: status.READING });
		const { path, name } = this.props;

		try {
			const cardData = await db
				.collection(Collections.CARDS)
				.find({ path, name })
				.first();
			console.log(cardData);
			this.setState({
				lang: cardData.lang,
				body: cardData.body,
				status: status.DONE,
			});
		} catch (error) {
			console.error(error);
			this.setStatus({ status: status.ERROR });
		}
	}

	changeEditLang = (e) => {
		const newEditLang = e.currentTarget.value;
		if (newEditLang !== "") this.setState({ editLang: newEditLang });
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

	render() {
		const editLang = this.state.editLang;
		const layoutLangsList = LayoutsStore.current.langs;
		// const cardLangsList = this.state.lang;
		return (
			<Window
				className="window"
				title={"Edit card: " + this.props.name}
				onClose={this.props.onClose}
			>
				<label htmlFor="card-lang">Current language:</label>
				<div className="justify-between">
					<select
						id="card-lang"
						style={{ width: "100%" }}
						value={editLang}
						onChange={this.changeEditLang}
					>
						{layoutLangsList.length > 0 ? (
							layoutLangsList.map((lang, index) => {
								const isUsed = this.getContent(lang.symbol).trim() !== "";
								return (
									<option key={index} value={lang.symbol}>
										{lang.name}
										{isUsed ? "*" : ""}
									</option>
								);
							})
						) : (
							<option key="no-lang">No language defined.</option>
						)}
						<option key="manage-langs" value="">
							Manage languages...
						</option>
					</select>
				</div>
				<div
					className="d-flex flex-column justify-content-start align-items-start"
					style={{ flexGrow: "2" }}
				>
					<label htmlFor="card-body">Body:</label>
					<textarea
						id="card-body"
						value={this.getContent(editLang)}
						onChange={this.setContent}
					/>
				</div>
				<div className="justify-right">
					<button onClick={this.saveCard}>Save card</button>
				</div>
			</Window>
		);
	}
}
