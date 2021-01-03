import { makeAutoObservable, runInAction } from "mobx";
import { Collections } from "../setup";
import { db } from "../libs/db";

export const status = {
	PENDING: "pending",
	DONE: "done",
	ERROR: "error",
};

class RoutesStore {
	status = "init";
	routes = [];

	constructor() {
		makeAutoObservable(this);
	}

	getStatus() {
		return this.status;
	}

	getRoutes() {
		return this.routes;
	}

	async fetchGet() {
		this.status = status.PENDING;
		try {
			const routes = await db.collection(Collections.ROUTES).find({}).toArray();
			runInAction(() => {
				this.status = status.DONE;
				if (routes) {
					this.routes = routes;
				} else {
					this.routes = [];
				}
			});
		} catch (error) {
			this.routes = [];
			this.status = status.ERROR;
			console.error(error);
		}
	}
}

let routesStore = (window.routesStore = new RoutesStore());
export default routesStore;
