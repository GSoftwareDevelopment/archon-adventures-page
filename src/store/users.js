import { makeAutoObservable, runInAction } from "mobx";
import { client, authorizeDB, db } from "../libs/db";
import { Collections } from "../setup";
import { toast } from "react-toastify";

export const state = {
	unknown: "unknown",
	anonymous: "anonymous",
	authorized: "authorized",
};

export const status = {
	INIT: "init",
	PENDING: "pending",
	SILENT: "silent",
	DONE: "done",
	WARN: "warn",
	ERROR: "error",
};

const disallowFields = ["displayName", "firstName", "lastName", "imageURL"];

class UsersStore {
	status = status.INIT;
	state = state.unknown;
	profile = null;
	customData = null;

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
		await this.fetchUserData();
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

	get userData() {
		return { profile: this.profile, customData: this.customData };
	}

	get userName() {
		if (this.customData) {
			if (this.customData.displayName) {
				return this.customData.displayName;
			} else if (this.customData.firstName || this.customData.lastName) {
				return this.customData.firstName + " " + this.customData.lastName;
			}
		}
		if (this.profile) {
			if (this.profile.data) {
				if (this.profile.data.email) {
					return this.profile.data.email;
				}
			}
		}
		return "Guset";
	}

	async fetchUserData() {
		const currentUser = this.getCurrentUser();
		if (currentUser) {
			await currentUser.auth.refreshCustomData().then(() => {
				runInAction(() => {
					this.customData = currentUser.customData;
					this.profile = currentUser.profile;
				});
			});
		} else {
			this.profile = null;
			this.customData = null;
		}
	}

	async updateUserCustomData(newCustomData) {
		const { _id, userId, role, ...oldCustomData } = this.customData;
		let $unset = undefined;
		for (const field in oldCustomData) {
			if (disallowFields.includes(field)) continue;
			if (!newCustomData[field]) {
				if (!$unset) $unset = {};
				$unset[field] = 1;
			}
		}
		try {
			const result = await db
				.collection(Collections.USERS)
				.updateOne(
					{ _id: { $oid: _id } },
					$unset
						? { $set: { ...newCustomData }, $unset }
						: { $set: { ...newCustomData } }
				);
			runInAction(() => {
				if (result.modifiedCount === 1) {
					toast.success("Your profile was updated.");
				} else {
					toast.error("Something went wrong!");
				}
			});
		} catch (error) {
			console.error(error);
			toast.error(error.message);
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

	async login(credentials, silent) {
		if (silent) this.status = status.SILENT;
		else this.status = status.PENDING;

		try {
			const user = await authorizeDB(credentials);
			runInAction(() => {
				if (user.loggedInProviderType === "anon-user") {
					this.state = state.anonymous;
				} else {
					this.state = state.authorized;
					toast.info("Hello " + user.profile.data.email);
				}
				this.status = status.DONE;
				console.log("Success logged in as ", user.loggedInProviderType);
				console.log(user);
			});
			return user;
		} catch (error) {
			console.error(error);
			runInAction(() => {
				this.state = state.unknown;
				toast.error(error.message);
				if (silent) this.status = status.WARN;
				else this.status = status.ERROR;
			});
			return undefined;
		}
	}

	async logout() {
		this.status = status.SILENT;
		try {
			// await client.auth.removeUser();
			await client.auth.logout();
			runInAction(() => {
				toast.info("You are log out.");
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
			this.status = status.WARN;
		}
	}
}

let usersStore = (window.usersStore = new UsersStore());
export default usersStore;
