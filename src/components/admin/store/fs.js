import { makeAutoObservable, runInAction } from "mobx";
import { db } from "../../../libs/db";

const status = {
	INIT: "init",
	PENDING: "pending",
	ERROR: "error",
	DONE: "done",
};

class FSStore {
	status = {};
	files = [];

	constructor() {
		makeAutoObservable(this);
	}

	isDone(collectionName) {
		return this.status[collectionName] === status.DONE;
	}

	async updateCollectionFS(collectionName) {
		console.log("> Reading FileSystem in '" + collectionName + "'...");
		this.status[collectionName] = status.PENDING;

		try {
			const files = await db
				.collection(collectionName)
				.find(
					{},
					{
						projection: { _id: 1, name: 1, path: 1, createdAt: 1 },
						sort: { path: 1, name: 1 },
					}
				)
				.asArray();

			runInAction(() => {
				this.files = this.files.filter((f) => f.collection !== collectionName);

				files.forEach((file) => {
					file.collection = collectionName;
					this.files.push(file);
				});

				this.status[collectionName] = status.DONE;
			});
		} catch (error) {
			console.error("FileSystem reading error:", error);
			this.status[collectionName] = status.ERROR;
		}
	}

	getFS(collectionName) {
		return this.files.filter((f) => f.collection === collectionName);
	}

	add({ _id, name, path, createdAt }, collectionName) {
		const newEntry = {
			_id,
			name,
			path,
			createdAt,
			collection: collectionName,
		};

		this.files.push(newEntry);
	}
}

const fsStore = (window.fsStore = new FSStore());
export default fsStore;
