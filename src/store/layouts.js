import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
	toJS,
} from "mobx";

import { Collections } from "../setup";
import { db } from "../libs/db";

//

export const Status = {
	INIT: "init",
	PENDING: "pending",
	SILENT: "silent",
	DONE: "done",
	WARN: "warn",
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
	message = "";
	layoutsList = [];
	elements = [];
	currentLang = "";

	constructor() {
		makeObservable(this, {
			status: observable,
			message: observable,
			layoutsList: observable,
			elements: observable,
			currentLang: observable,
			//
			currentStatus: computed,
			getMessage: computed,
			available: computed,
			default: computed,
			current: computed,
			getCurrentLang: computed,
			//
			resetMessage: action,
			updateElementAttr: action,
			setCurrentLang: action,
			getElementById: action,
			moveItemInNode: action,
			fetchList: action,
		});
	}

	get currentStatus() {
		return this.status;
	}

	get getMessage() {
		return this.message;
	}

	resetMessage() {
		this.message = "";
	}

	get available() {
		return this.layoutsList;
	}

	get default() {
		return this.layoutsList.find((layout) => layout.default);
	}

	get current() {
		return this.layoutsList.find((layout) => layout.current);
	}

	get getCurrentLang() {
		return this.currentLang;
	}

	setCurrentLang(lang) {
		this.status = Status.PENDING;
		runInAction(() => {
			this.currentLang = lang;
			this.status = Status.DONE;
		});
	}

	getElementById(id) {
		return this.elements.find((el) => el._id === id);
	}

	getElementsByContentType(rootNode, contentType) {}

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

	async updateElementAttr(id, updateAttr) {
		const element = this.getElementById(id);

		for (const attrKey in updateAttr) {
			element[attrKey] = updateAttr[attrKey];
		}

		this.status = Status.SILENT;
		const { _id, ...updateElement } = toJS(element);

		try {
			const result = await db
				.collection(Collections.LAYOUT)
				.updateOne({ _id: { $oid: id } }, updateElement);
			runInAction(() => {
				console.log(result);
				if (result.matchedCount === 1 && result.modifiedCount === 1) {
					this.status = Status.DONE;
					this.message = "Element was correct updated.";
				} else {
					this.status = Status.WARN;
					this.message = "Unexcepted error. Element is NOT updated!";
				}
			});
		} catch (error) {
			console.error(error);
			this.status = Status.WARN;
			this.message = error.message;
		}
	}

	async fetchList(silent = false) {
		if (silent) this.status = Status.SILENT;
		else this.status = Status.PENDING;
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
				const defaultLayout = this.layoutsList.find((layout) => layout.default);
				defaultLayout.current = true;
				this.currentLang = defaultLayout.defaultLang;

				this.status = Status.DONE;
			});
		} catch (error) {
			console.error(error);
			if (silent) this.status = Status.WARN;
			else this.status = Status.ERROR;
			this.message = error.message;
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
