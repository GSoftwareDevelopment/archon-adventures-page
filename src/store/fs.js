import { makeAutoObservable, runInAction, toJS } from "mobx";
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
						projection: {
							_id: 1,
							name: 1,
							path: 1,
							userId: 1,
							createdAt: 1,
						},
						sort: { path: 1, name: 1 },
					}
				)
				.asArray();

			runInAction(() => {
				// debugger;
				// mark all existing entry for collectionName by adding update flag sets on false
				const entrys = this.files
					.map((file, index) => {
						if (file.collection === collectionName) {
							return { index, _update: false };
						} else {
							return null;
						}
					})
					.filter((entry) => entry !== null);

				// for each entry getted from db:
				files.forEach((file) => {
					// prepare file for entry
					file._id = file._id.toString();
					file.collection = collectionName;
					// 		check, if exist in collection:
					const entry = entrys.find((entry) => {
						const fileEntry = this.files[entry.index];
						return fileEntry._id === file._id.toString();
					});
					if (entry) {
						// 	if exist, update entry data
						this.files[entry.index] = file;
						// 	set update flag to true for entry.
						entry._update = true;
					} else {
						// 	if not exist, add entry to collection
						this.files.push(file);
					}
				});

				// for each entry in collectionName:
				entrys.reverse().forEach((entry) => {
					// 		check update flag:
					if (!entry._update) {
						// 			if not set, remove entry
						delete this.files[entry.index];
					}
				});

				// old
				// this.files = this.files.filter((f) => f.collection !== collectionName);

				// files.forEach((file) => {
				// 	file._id = file._id.toString();
				// 	file.collection = collectionName;
				// 	this.files.push(file);
				// });

				this.status[collectionName] = status.DONE;
			});
		} catch (error) {
			console.error("FileSystem reading error:", error);
			this.status[collectionName] = status.ERROR;
		}
	}

	fileList(collectionName) {
		return toJS(this.files.filter((f) => f.collection === collectionName));
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

	//

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

			// TODO: update fslog
			// const logData={
			// 	type:"modify",
			// 	fsId: this.cardData._id,
			// 	userId: this.cardData.userId,
			// 	timestamp: new Date()
			// };

			// await db.collection(Collections.FSLOG).insertOne(logData);
		} else if (result.insertedId) {
			this.add({ ...entry, _id: result.insertedId }, collectionName);
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
