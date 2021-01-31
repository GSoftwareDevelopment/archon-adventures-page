import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from "mobx";

import { Collections } from "../../../setup";
import { db } from "../../../libs/db";

export const Status = {
	INIT: "init",
	PENDING: "pending",
	DONE: "done",
	ERROR: "error",
};

export const ContentTypes = {
	LAYOUT: "layout",

	// container blocks types
	MENULINK: "menu-link",
	ROUTERCONTENT: "router-content",

	// content blocks types
	LANGSELECTOR: "lang-selector",
	CARD: "card",
	CALENDAR: "calendar",
	GALERY: "galery",
	COMMENTS: "comments",
};

class LayoutsStore {
	status = Status.INIT;
	layoutsList = [];
	elements = [];

	constructor() {
		makeObservable(this, {
			status: observable,
			layoutsList: observable,
			elements: observable,
			//
			currentStatus: computed,
			available: computed,
			default: computed,
			current: computed,
			//
			getElementById: action,
			moveItemInNode: action,
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

	getElementById(id) {
		return this.elements.find((el) => el._id === id);
	}

	moveItemInNode(nodeId, itemIndex, direction) {
		const nodeChilds = this.getElementById(nodeId).childs;

		if (direction < 0) {
			const itemSrc = nodeChilds[itemIndex];
			const itemDst = nodeChilds[itemIndex - 1];
			nodeChilds[itemIndex - 1] = itemSrc;
			nodeChilds[itemIndex] = itemDst;
		} else if (direction > 0) {
			const itemSrc = nodeChilds[itemIndex];
			const itemDst = nodeChilds[itemIndex + 1];
			nodeChilds[itemIndex + 1] = itemSrc;
			nodeChilds[itemIndex] = itemDst;
		}
	}

	async fetchList() {
		this.status = Status.PENDING;
		try {
			const elements = await db
				.collection(Collections.LAYOUT)
				.find({})
				.asArray();

			runInAction(() => {
				this.elements = elements.map((el) => ({
					...el,
					_id: el._id.toString(),
				}));
				this.layoutsList = this.elements.filter(
					(el) => el.contentType === ContentTypes.LAYOUT
				);

				this.status = Status.DONE;
			});
		} catch (error) {
			console.error(error);
			this.status = Status.ERROR;
		}
	}

	// async migrate(item, parrentId = null) {
	// 	let { _id, scheme, elements, ___collapsed, ...elProps } = item;

	// 	if (scheme) elements = scheme;
	// 	if (parrentId) elProps.parrent = parrentId;
	// 	let childs = [];

	// 	try {
	// 		let result = await db.collection(Collections.LAYOUT).insertOne(elProps);
	// 		_id = result.insertedId;
	// 		console.log(_id);
	// 		if (elements) {
	// 			const promises = elements.map(
	// 				(item) =>
	// 					new Promise((resolve, reject) => resolve(this.migrate(item, _id)))
	// 			);
	// 			childs = await Promise.all(promises);

	// 			console.log(childs);
	// 			elProps.childs = childs;
	// 			result = await db
	// 				.collection(Collections.LAYOUT)
	// 				.updateOne({ _id }, elProps);

	// 			console.log(result);
	// 		}
	// 		return _id;
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// }
}

const _LayoutsStore = new LayoutsStore();
export default _LayoutsStore;
