import React, { Component } from "react";
import { client, db } from "../../libs/db";

import "./card-edit.scss";
import Alert from "../layout/Alert";
import Window from "../layout/Window";

export default class CardEdit extends Component {
	constructor(props) {
		super(props);

		let defaultLang = props.lang || "";
		if (!props.lang && props.card && props.card.lang.length > 0) {
			defaultLang = props.card.lang[0];
		}

		this.state = {
			card: props.card,
			currentLang: props.lang ? props.lang : defaultLang,
			saving: false,
			content: props.card ? props.card.body[defaultLang] : "",
			errorType: "",
			error: "",
		};
	}

	async componentDidMount() {
		try {
			// await authorizeDB();
			console.log("Card edit", client.auth.currentUser);
		} catch (error) {
			console.error(error);
		}
	}

	saveCard = async (e) => {
		this.setState({ errorType: "", saving: true });
		e.preventDefault();

		const { _id: cardId, ...cardData } = this.state.card;

		try {
			await db
				.collection("card")
				.updateOne({ _id: cardId }, cardData)
				.then((result) => {
					this.setState({
						saving: false,
						errorType: "success",
						error: "Successfull updated",
					});
					console.log(result);
					// const content = card[0].body["en"];
					// this.setState({ content });
				});
		} catch (error) {
			console.error(error);
			this.setState({
				saving: false,
				errorType: "error",
				error: error.message,
			});
		}
	};

	createLang = (e) => {
		e.preventDefault();

		let newLang = prompt("Enter language shortcut:");
		if (newLang) newLang = newLang.trim().toLowerCase();
		if (newLang) {
			const langs = this.state.card.lang;
			if (!langs.includes(newLang)) {
				langs.push(newLang);
				let newCard = { ...this.state.card };
				newCard.lang = langs;
				newCard.body[newLang] = "";

				this.setState({
					card: newCard,
					currentLang: newLang,
					content: newCard.body[newLang],
				});
			} else {
				alert("Entered value is exist");
			}
		}
	};

	changeLang = (e) => {
		e.preventDefault();

		const currentLang = e.target.value;
		this.setState({ currentLang, content: this.state.card.body[currentLang] });
	};

	updateContent = (e) => {
		let updatedCard = { ...this.state.card };
		updatedCard.body[this.state.currentLang] = e.target.value;
		this.setState({ card: updatedCard, content: e.target.value });
		this.props.onUpdate(updatedCard);
	};

	render() {
		return (
			<Window
				className="card-edit"
				title={"Edit card: " + (this.state.card ? this.state.card.name : "")}
				onClose={this.props.onClose}
			>
				<div className="justify-between">
					<label htmlFor="card-lang">Current language:</label>
					<div>
						<select
							id="card-lang"
							value={this.state.currentLang}
							onChange={this.changeLang}
						>
							{this.state.card && this.state.card.lang.length > 0 ? (
								this.state.card.lang.map((lang, index) => (
									<option key={index} value={lang}>
										{lang}
									</option>
								))
							) : (
								<option key="no-lang">No language defined.</option>
							)}
						</select>
						<button onClick={this.createLang}>Add...</button>
					</div>
				</div>
				<div
					className="d-flex flex-column justify-content-start align-items-start"
					style={{ height: "calc(100% - 85px)" }}
				>
					<label htmlFor="card-body">Body:</label>
					<textarea
						id="card-body"
						disabled={this.state.currentLang === ""}
						value={this.state.content}
						onChange={this.updateContent}
						style={{ height: "100%" }}
					/>
				</div>
				<div className="justify-right">
					{this.state.error && (
						<Alert
							className="info"
							variant={this.state.errorType}
							onHide={(e) => {
								e.preventDefault();
								this.setState({ error: "" });
							}}
						>
							{this.state.error}
						</Alert>
					)}
					{!this.state.saving ? (
						<button onClick={this.saveCard}>Save card</button>
					) : (
						<button disabled>Saving...</button>
					)}
				</div>
			</Window>
		);
	}
}

export const CardEditControl = (props) => {
	const currentUser = client.auth.currentUser;
	if (!currentUser || currentUser.loggedInProviderType !== "local-userpass")
		return null;
	return (
		<div className="card-control">
			<button
				onClick={(e) => {
					e.preventDefault();
					props.onEdit();
				}}
			>
				Edit card
			</button>
		</div>
	);
};
