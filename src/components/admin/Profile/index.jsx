import "../scss/profile.scss";

import React, { Component } from "react";
import UsersStore from "../../../store/users";
import * as Messages from "../../../libs/Messages.js";
import { toast } from "react-toastify";

import { ClipboardData as IconDashboard } from "react-bootstrap-icons";
import BasicFields from "./BasciFields";
import ExtraFields from "./ExtraFields";
import Security from "./Security";
import ContentLoader from "../../layout/ContentLoader";

export default class Profile extends Component {
	state = {
		status: "init",
		newExtraField: false,
		customData: { displayName: "", firstName: "", lastName: "", imageURL: "" },
		extraData: {},
		extraVisibility: [],
	};

	async componentDidMount() {
		await UsersStore.fetchUserData();
		const { customData } = UsersStore.userData;
		if (customData) {
			const { _id, userId, role, extraVisibility, ...info } = customData;
			const { displayName, firstName, lastName, imageURL, ...extra } = info;
			const basic = { displayName, firstName, lastName, imageURL };
			this.setState({ customData: basic, extraData: extra, extraVisibility });
		}
		this.setState({ status: "done" });
	}

	updateCustomData = ({ field, value }) => {
		const customData = this.state.customData;
		customData[field] = value;
		this.setState({ customData });
	};

	updateExtraData = ({ field, value }) => {
		const extraData = this.state.extraData;
		extraData[field] = value.trim();
		this.setState({ extraData });
	};

	updateExtraVisibility = (v) => {
		this.setState({ extraVisibility: v });
	};

	deleteExtraData(field) {
		const extraData = this.state.extraData;
		delete extraData[field];
		this.setState({ extraData });
		toast.info(
			Messages.getTextAsMarkdown(
				"admin.account.profile.extraFields.toast.fieldDeleted"
			)
		);
	}

	updateProfile = async (e) => {
		e.preventDefault();
		this.setState({ status: "update" });
		await UsersStore.updateUserCustomData({
			...this.state.customData,
			...this.state.extraData,
			extraVisibility: this.state.extraVisibility,
		});
		this.setState({ status: "done" });
	};

	render() {
		return (
			<React.Fragment>
				<div className="header">
					<IconDashboard size="2em" />
					{Messages.getText("admin.account.profile.title")}
				</div>
				{this.state.status !== "init" ? (
					<form className="content">
						<BasicFields
							fields={this.state.customData}
							onChange={this.updateCustomData}
						/>
						<ExtraFields
							fields={this.state.extraData}
							visibility={this.state.extraVisibility}
							onChange={this.updateExtraData}
							onToggleVisibility={this.updateExtraVisibility}
							onDelete={(field) => {
								this.deleteExtraData(field);
							}}
						/>
						<Security />

						<div className="footer">
							{this.state.status === "update" ? (
								<button onClick={() => {}}>
									{Messages.getText(
										"admin.account.profile.button.updateProgress"
									)}
								</button>
							) : (
								<button onClick={this.updateProfile}>
									{Messages.getText(
										"admin.account.profile.button.updateProfile"
									)}
								</button>
							)}
						</div>
					</form>
				) : (
					<h2 className="content">
						{Messages.getText("admin.account.profile.pendingData")}
						<ContentLoader busy={true} />
					</h2>
				)}
			</React.Fragment>
		);
	}
}
