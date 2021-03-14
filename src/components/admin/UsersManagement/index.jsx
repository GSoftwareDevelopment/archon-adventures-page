import "../scss/users-management.scss";

import React, { Component } from "react";
// import UsersStore, { userRole as Roles } from "../../store/users";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";

import { PeopleFill as IconUsers } from "react-bootstrap-icons";
import ContentLoader from "../../layout/ContentLoader";

//

const Status = {
	INIT: "init",
	DONE: "done",
};

export default class index extends Component {
	state = {
		status: Status.INIT,
		users: [],
	};

	columns = ["userId", "role", "firstName", "lastName", "displayName"];

	async componentDidMount() {
		const usersList = await db.collection(Collections.USERS).find({}).asArray();
		this.setState({ users: usersList, status: Status.DONE });
	}

	render() {
		// const userRole = UsersStore.userRole;
		return (
			<React.Fragment>
				<div className="header">
					<IconUsers size="2em" />
					Users Management
				</div>
				<div className="content">
					<UsersListHeader columns={this.columns}>
						<ContentLoader busy={this.state.status === Status.INIT}>
							<UsersList columns={this.columns} data={this.state.users} />
						</ContentLoader>
					</UsersListHeader>
				</div>
			</React.Fragment>
		);
	}
}

function UsersListHeader({ columns, children }) {
	return (
		<div className="users-list">
			<div className="row header">
				{columns.map((columnId) => {
					return (
						<div key={columnId} className={`col ${columnId}`}>
							{columnId}
						</div>
					);
				})}
			</div>
			{children}
		</div>
	);
}

function UsersList({ columns, data }) {
	return data.map((user) => {
		return (
			<div key={user._id} className="row selectable">
				{columns.map((columnId) => {
					return (
						<div key={columnId} className={`col ${columnId}`}>
							{user[columnId]}
						</div>
					);
				})}
			</div>
		);
	});
}
