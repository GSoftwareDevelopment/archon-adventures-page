import { makeAutoObservable, runInAction } from "mobx";
import { db } from "../libs/db";

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
						projection: { _id: 1, name: 1, path: 1, userId:1, createdAt: 1 },
						sort: { path: 1, name: 1 },
					}
				)
				.asArray();

			runInAction(() => {
				this.files = this.files.filter((f) => f.collection !== collectionName);

				files.forEach((file) => {
					file._id=file._id.toString();
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

	fileList(collectionName) {
		return this.files.filter((f) => f.collection === collectionName);
	}

	add({ _id, name, path, userId, createdAt }, collectionName) {
		const newEntry = {
			_id:_id.toString(),
			name,
			path,
			createdAt,
			userId,
			collection: collectionName,
		};

		this.files.push(newEntry);
	}

	remove({ _id }, collectionName) {
		const index = this.files.findIndex(
			(f) => f.collection === collectionName && f._id === _id
		);
		if (index !== -1) this.files.splice(index,1);
	}
}

const fsStore = (window.fsStore = new FSStore());
export default fsStore;
