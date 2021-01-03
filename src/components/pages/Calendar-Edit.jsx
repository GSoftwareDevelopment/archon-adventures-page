import React, { Component } from "react";
import { observer } from "mobx-react";
import UsersStore, { state } from "../../store/users";

import { db } from "../../libs/db";
import { Paths, Collections } from "../../setup";

import "./calendar-edit.scss";
import Alert from "../layout/Alert";
import { Selector } from "./Selector";
import Window from "../layout/Window";

export class CalendarEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			entry: props.entry,
			isSelector: false,
			errorType: "",
			error: "",
		};
	}

	updateEntryField = (fieldName, newValue, oldEntryState) => {
		if (typeof oldEntryState === "undefined") {
			const newEntry = {
				...this.state.entry,
				[fieldName]: newValue,
			};
			return newEntry;
		} else {
			const newEntry = {
				...oldEntryState,
				[fieldName]: newValue,
			};
			return newEntry;
		}
	};

	setEntry(newEntry) {
		this.setState({
			entry: newEntry,
		});
		this.props.onUpdate(newEntry);
	}

	// controler events

	showSelector = (e) => {
		e.preventDefault();
		this.setState({ isSelector: !this.state.isSelector });
	};

	hideSelector = (e) => {
		this.setState({ isSelector: false });
	};

	updateDate = (e) => {
		const newEntry = this.updateEntryField("date", new Date(e.target.value));
		this.setEntry(newEntry);
	};

	updateTitle = (e) => {
		const newCardRefTo = e.target.value;
		let newEntry = this.updateEntryField("title", newCardRefTo);
		if (this.state.entry && !this.state.entry._id) {
			newEntry = this.updateEntryField(
				"cardRefTo",
				newCardRefTo.toString().replace(/[^0-9A-Za-z-]/g, "-"),
				newEntry
			);
		}
		this.setEntry(newEntry);
	};

	updateDescription = (e) => {
		const newEntry = this.updateEntryField("description", e.target.value);
		this.setEntry(newEntry);
	};

	updateCardRefTo = (newCardRefTo) => {
		const newEntry = this.updateEntryField(
			"cardRefTo",
			newCardRefTo.toString().replace(/[^0-9A-Za-z-]/g, "")
		);
		this.setEntry(newEntry);
	};

	async createEntry(entry) {
		// create new entry
		const lang = this.props.lang;

		let result;

		// first: Check if the given card name can be created?
		const find = { path: Paths.Calendar, name: entry.cardRefTo };
		result = await db.collection(Collections.CARDS).findOne(find);
		if (result) throw new Error(`Can't create card. Name is in use.`);

		// prepare fields for new card entry
		const newCard = {
			...find,
			body: { [lang]: "" },
			lang: [lang],
			createdAt: new Date(),
		};

		// create card
		result = await db.collection(Collections.CARDS).insertOne(newCard);
		if (!result) {
			console.log(result);
			throw new Error("Some think wrong in DB. Check last console log.");
		}

		// create calendar entry
		result = await db.collection(Collections.CALENDAR).insertOne(entry);
		if (!result) {
			console.log(result);
			throw new Error("Some think wrong in DB. Check last console log.");
		}

		this.setState({
			saving: false,
			errorType: "success",
			error: "Create successfull :)",
		});
	}

	async updateEntry(entry) {
		// update entry
		await db
			.collection(Collections.CALENDAR)
			.updateOne({ _id: entry._id }, entry)
			.then((result) => {
				this.setState({
					saving: false,
					errorType: "success",
					error: "Update successfull",
				});
				console.log(result);
			});
	}

	saveEntry = async (e) => {
		this.setState({ saving: true });
		e.preventDefault();

		const entry = this.state.entry;

		try {
			if (!entry._id) {
				await this.createEntry(entry);
			} else {
				await this.updateEntry(entry);
			}
		} catch (error) {
			console.error(error);
			this.setState({
				saving: false,
				errorType: "error",
				error: error.message,
			});
		}

		this.setEntry(entry);
	};

	isValidate = () => {
		const entry = this.state.entry;
		return entry.cardRefTo.trim() !== "" && entry.title.trim() !== "";
	};
	//

	render() {
		if (UsersStore.getState() !== state.authorized) return null;
		if (!this.state.entry) return null;
		const newEntry = this.state.entry && !this.state.entry._id;
		if (!this.state.isSelector) {
			return (
				<Window
					className="calendar-edit"
					title={
						newEntry ? (
							<span>Create calendar entry</span>
						) : (
							<span>Edit calendar entry</span>
						)
					}
					onClose={this.props.onClose}
				>
					<div className="justify-between">
						<label htmlFor="entry-date">Date:</label>
						<input
							id="entry-date"
							type="date"
							value={
								Boolean(this.state.entry)
									? this.state.entry.date.toISOString().split("T")[0]
									: ""
							}
							onChange={this.updateDate}
						/>
					</div>
					<div className="d-flex flex-column justify-content-start align-items-start">
						<label htmlFor="entry-title">Title:</label>
						<input
							id="entry-title"
							type="text"
							value={this.state.entry ? this.state.entry.title : ""}
							onChange={this.updateTitle}
						/>
						<label htmlFor="entry-description">Description:</label>
						<textarea
							id="entry-description"
							value={this.state.entry ? this.state.entry.description : ""}
							onChange={this.updateDescription}
						/>
					</div>
					<div className="justify-between">
						<label htmlFor="entry-cardRefTo">Card:</label>
						<input
							id="entry-cardRefTo"
							type="text"
							readOnly={!newEntry}
							value={this.state.entry ? this.state.entry.cardRefTo : ""}
							onChange={(e) => {
								this.updateCardRefTo(e.target.value);
							}}
						/>
						{!newEntry && <button onClick={this.showSelector}>...</button>}
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
							<button disabled={!this.isValidate()} onClick={this.saveEntry}>
								Save entry
							</button>
						) : (
							<button disabled>Saving...</button>
						)}
					</div>
				</Window>
			);
		} else {
			return (
				<Selector
					collection="card"
					path={Paths.Calendar}
					namesOnly={true}
					filepath={this.state.entry ? this.state.entry.cardRefTo : ""}
					onClose={this.hideSelector}
					onChoice={this.updateCardRefTo}
				/>
			);
		}
	}
}

export const CalendarEditControl = observer((props) => {
	if (UsersStore.getState() !== state.authorized) return null;
	if (props.forAll) {
		return (
			<div className="calendar-control">
				<button
					onClick={(e) => {
						e.preventDefault();
						props.onCreate();
					}}
				>
					Create entry
				</button>
			</div>
		);
	} else {
		return (
			<div className="calendar-control">
				<button
					onClick={(e) => {
						e.preventDefault();
						props.onEdit();
					}}
				>
					Edit entry
				</button>
			</div>
		);
	}
});
