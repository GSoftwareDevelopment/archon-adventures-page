import { makeAutoObservable, runInAction } from "mobx";
import { Collections } from "../setup";
import { db } from "../libs/db";

export const status = {
	INIT: "init",
	PENDING: "pending",
	DONE: "done",
	ERROR: "error",
};

class LayoutsStore {
	status = "init";
	schema = [];

	constructor() {
		makeAutoObservable(this);
	}

	getStatus() {
		return this.status;
	}

	getSchema() {
		return this.schema;
	}

	getSchemaElements(contentType) {
		const content = this.schema.find(
			(contentItem) => contentItem.contentType === contentType
		);
		if (content && content.elements) return content.elements;
		else return [];
	}

	async fetchGet(find) {
		console.log("Fetching layout settings...");
		this.status = status.PENDING;
		try {
			const layout = await db.collection(Collections.LAYOUT).find(find).first();
			runInAction(() => {
				if (layout) {
					console.log(`Layout '${layout.name}' loaded.`);
					this.schema = layout.scheme;
					this.status = status.DONE;
				} else {
					console.log(`Can't find current layout :/`);
					this.schema = [];
					this.status = status.ERROR;
				}
			});
		} catch (error) {
			this.schema = [];
			this.status = status.ERROR;
			console.error(error);
		}
	}
}

let layoutsStore = (window.layoutsStore = new LayoutsStore());
export default layoutsStore;
