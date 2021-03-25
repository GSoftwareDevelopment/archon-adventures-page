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

	async updateCollectionFS(
		collectionName,
		sort = { path: 1, name: 1 },
		extraFields = {}
	) {
		console.log("> Reading FileSystem in '" + collectionName + "'...");
		this.status[collectionName] = status.PENDING;

		const projection = {
			_id: 1,
			name: 1,
			path: 1,
			userId: 1,
			createdAt: 1,
			...extraFields,
		};

		try {
			const files = await db
				.collection(collectionName)
				.find({}, { projection, sort })
				.asArray();

			runInAction(() => {
				this.files = this.files.filter((f) => f.collection !== collectionName);

				files.forEach((file) => {
					file._id = file._id.toString();
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
			_id: _id.toString(),
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
		if (index !== -1) this.files.splice(index, 1);
	}

	async read(find, collectionName) {
		const fileData = await db.collection(collectionName).find(find).first();
		return fileData;
	}

	async store(entry, collectionName) {
		let result;

		if (entry._id) {
			// Update
			result = await db
				.collection(collectionName)
				.updateOne({ _id: entry._id }, entry);
		} else {
			// Create
			result = await db.collection(collectionName).insertOne(entry);
		}

		if (result.modifiedCount === 1) {
			this.updateCollectionFS(collectionName);

			// // update fslog
			// const logData={
			// 	type:"modify",
			// 	fsId: this.cardData._id,
			// 	userId: this.cardData.userId,
			// 	timestamp: new Date()
			// };

			// await db.collection(Collections.FSLOG).insertOne(logData);
		} else if (result.insertedId) {
			this.add(entry, collectionName);
		}

		return result;
	}

	async delete({ _id }, collectionName) {
		const result = await db
			.collection(collectionName)
			.deleteOne({ _id: { $oid: _id } });
		if (result.deletedCount === 1) {
			this.remove({ _id }, collectionName);
		}

		return result;
	}
}

const fsStore = (window.fsStore = new FSStore());
export default fsStore;
