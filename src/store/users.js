import { makeAutoObservable, runInAction } from "mobx";
import { client, authorizeDB } from "../libs/db";

export const state = {
	unknown: "unknown",
	anonymous: "anonymous",
	authorized: "authorized",
};

export const status = {
	INIT: "init",
	PENDING: "pending",
	DONE: "done",
	ERROR: "error",
};

class UsersStore {
	status = status.INIT;
	state = state.unknown;

	constructor() {
		makeAutoObservable(this);
	}

	async init() {
		let currentUser = client.auth.currentUser;
		console.log("Initialize DB user...");
		if (!currentUser) {
			currentUser = await this.login();
		} else {
			if (currentUser.loggedInProviderType === "anon-user") {
				this.state = state.anonymous;
			} else {
				this.state = state.authorized;
			}
			client.auth.switchToUserWithId(currentUser.id);
			this.status = status.DONE;
		}
		console.log(currentUser);
	}

	getStatus() {
		return this.status;
	}
	getState() {
		return this.state;
	}

	getCurrentUser() {
		const currentUser = client.auth.currentUser;
		if (currentUser) {
			return currentUser;
		} else {
			return undefined;
		}
	}

	getCurrentUserName() {
		const currentUser = this.getCurrentUser();
		if (currentUser) {
			const userData = currentUser.profile.data;
			let currentUserName = "Guest";
			if (userData && userData.email) currentUserName = userData.email;
			return currentUserName;
		} else {
			return "Guest";
		}
	}

	getAllUsersAuthInfo() {
		return client.auth.allUsersAuthInfo;
	}

	isAnonymous() {
		const currentUser = this.getCurrentUser();
		if (currentUser && currentUser.loggedInProviderType !== "anon-user") {
			return false;
		}

		return true;
	}

	async login(credentials) {
		this.status = status.PENDING;

		try {
			const user = await authorizeDB(credentials);
			runInAction(() => {
				if (user.loggedInProviderType === "anon-user") {
					this.state = state.anonymous;
				} else {
					this.state = state.authorized;
				}
				this.status = status.DONE;
				console.log("Success logged in as ", user.loggedInProviderType);
			});
			return user;
		} catch (error) {
			console.error(error);
			this.state = state.unknown;
			this.status = status.ERROR;
		}
	}

	async logout() {
		this.status = status.PENDING;
		try {
			// await client.auth.removeUser();
			await client.auth.logout();
			runInAction(() => {
				this.state = "unknown";
				const users = this.getAllUsersAuthInfo();
				users.forEach((user) => {
					if (user.loggedInProviderType === "anon-user" && user.isLoggedIn) {
						client.auth.switchToUserWithId(user.userId);
						this.state = state.anonymous;
						return true;
					}
				});
				if (!this.getCurrentUser()) {
					this.init();
				} else {
					this.status = status.DONE;
				}
			});
		} catch (error) {
			console.error(error);
			// this.state = state.error;
			this.status = status.ERROR;
		}
	}
}

let usersStore = (window.usersStore = new UsersStore());
export default usersStore;
