import "../scss/users-management.scss";

import React, { Component } from "react";
// import UsersStore, { userRole as Roles } from "../../store/users";
import { db } from "../../../libs/db";
import { Collections } from "../../../setup";

import { PeopleFill as IconUsers } from "react-bootstrap-icons";

export default class index extends Component {
	state = {
		users: [],
	};

	columns = ["userId", "role", "firstName", "lastName", "displayName"];

	async componentDidMount() {
		const usersList = await db.collection(Collections.USERS).find({}).asArray();
		this.setState({ users: usersList });
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
					<UsersList columns={this.columns} data={this.state.users} />
				</div>
			</React.Fragment>
		);
	}
}

function UsersList({ columns, data }) {
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
			{data.map((user) => {
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
			})}
		</div>
	);
}
