import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from "mobx";

import { Collections } from "../../../setup";
import { db } from "../../../libs/db";

export const status = {
	INIT: "init",
	PENDING: "pending",
	DONE: "done",
	ERROR: "error",
};

class LayoutsStore {
	status = status.INIT;
	layoutsList = [];

	constructor() {
		makeObservable(this, {
			status: observable,
			layoutsList: observable,
			default: computed,
			current: computed,
			currentStatus: computed,
			available: computed,
			fetchList: action,
		});
	}

	get currentStatus() {
		return this.status;
	}

	get available() {
		return this.layoutsList;
	}

	get default() {
		return this.layoutsList.find((layout) => layout.current);
	}

	get current() {
		return this.layoutsList.find((layout) => layout.current);
	}

	async fetchList() {
		this.status = status.PENDING;
		try {
			const layouts = await db
				.collection(Collections.LAYOUT)
				.find({})
				.asArray();

			runInAction(() => {
				layouts.forEach((layout) => {
					layout.default = layout.current;
				});

				this.layoutsList = layouts;

				this.status = status.DONE;
			});
		} catch (error) {
			console.error(error);
			this.status = status.ERROR;
		}
	}
}

const _LayoutsStore = new LayoutsStore();
export default _LayoutsStore;
