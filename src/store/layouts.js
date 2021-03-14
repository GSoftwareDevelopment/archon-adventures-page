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
import { toast } from "react-toastify";

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
	HEADER: "header",
	MENUROUTER: "menu-router",
	ROUTERCONTENT: "router-content",
	ROW: "row",
	COLUMN: "column",
	FOOTER: "footer",

	// content blocks types
	MENULINK: "menu-link",
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
			insertElement: action,
			deleteElement: action,
			updateElementAttr: action,
			setCurrentLang: action,
			getElementById: action,
			getElementsByContentType: action,
			moveElementInNode: action,
			fetchList: action,
			//
			// addError: action,
			// clearError: action,
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

	getElementsByContentType(contentType, rootNode) {
		if (!rootNode) {
			return this.elements.filter((el) => el.contentType === contentType);
		} else {
			// TODO: Search the content recursively
		}
	}

	moveElementInNode(nodeId, itemIndex, direction) {
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

		// TODO: Update node in DB!!!
	}

	insert(element, destElementId, destChildsIndex) {
		const destElement = this.getElementById(destElementId);
		const destChilds = destElement.childs;
		this.elements.push(element);
		destChilds.splice(destChildsIndex, 0, element._id);
	}

	insertElement(element, destElementId, destChildsIndex) {
		this.status = Status.SILENT;
		const destElement = this.getElementById(destElementId);

		try {
			// create new element in DB

			db.collection(Collections.LAYOUT)
				.insertOne(element)
				.then((result) => {
					if (result?.insertedId) {
						const newId = result.insertedId;
						const childs = toJS(destElement).childs;
						childs.splice(destChildsIndex, 0, newId);

						// update childs list in parent element in DB
						db.collection(Collections.LAYOUT)
							.updateOne({ _id: { $oid: destElementId } }, { $set: { childs } })
							.then((result) => {
								if (result.modifiedCount === 1) {
									runInAction(() => {
										const parentElement = this.getElementById(destElementId);

										// add new element & update childs list in parent element - local
										element._id = newId.toString();
										this.elements.push(element);
										parentElement.childs.splice(
											destChildsIndex,
											0,
											element._id
										);
									});
									this.status = Status.DONE;
									toast.success("Element is added.");
								} else {
									toast.error("Something went wrong");
								}
							});
					}
				});
		} catch (error) {
			toast.error(error.message);
			console.error(error);
			this.status = Status.WARN;
			this.message = error.message;
			return undefined;
		}
	}

	deleteElement(elementId, updateParentNode = true) {
		this.status = Status.SILENT;
		const element = toJS(this.getElementById(elementId));
		console.log(elementId, element);

		if (element.childs?.length > 0)
			element.childs.forEach((childrenId) => {
				this.deleteElement(childrenId.toString(), false);
			});

		try {
			// delete element from DB
			db.collection(Collections.LAYOUT)
				.deleteOne({ _id: { $oid: element._id } })
				.then((result) => {
					console.log("Delete result:", result);

					if (updateParentNode) {
						//
						const parentElement = this.getElementById(element.parrent);
						const childs = [...parentElement.childs];
						const index = childs.findIndex(
							(id) => id.toString() === element._id
						);
						if (index > -1) {
							childs.splice(index, 1);

							// update childs in parent element in DB
							db.collection(Collections.LAYOUT)
								.updateOne(
									{ _id: { $oid: parentElement._id } },
									{ $set: { childs } }
								)
								.then((result) => {
									console.log("Child update result:", result);

									runInAction(() => {
										// update child in parent element local
										parentElement.childs.splice(index, 1);
									});
								});
						} else {
							// can't find element ID in childs!!
							runInAction(() => {
								this.status = Status.WARN;
								console.error(
									`Children element ID#${element._id} is not found in parent element #${element.parrent}`
								);
							});
						}
					}
					runInAction(() => {
						this.status = Status.DONE;
					});
				});
		} catch (error) {
			toast.error(error.message);
			console.error(error);
			this.status = Status.WARN;
			this.message = error.message;
			return undefined;
		}
	}

	async updateElementAttr(id, updateAttr) {
		const updatedElement = { ...this.getElementById(id) };

		for (const attrKey in updateAttr)
			updatedElement[attrKey] = updateAttr[attrKey];

		//

		this.status = Status.SILENT;
		const { _id, _error, ...updateElement } = toJS(updatedElement);

		try {
			const result = await db
				.collection(Collections.LAYOUT)
				.updateOne({ _id: { $oid: id } }, updateElement);

			runInAction(() => {
				const contentType = updateElement.contentType.toUpperCase();
				if (result.matchedCount === 1 && result.modifiedCount === 1) {
					let element = this.getElementById(id);
					for (const attrKey in updateAttr)
						element[attrKey] = updateAttr[attrKey];

					this.status = Status.DONE;
					toast.success(`${contentType} element updated.`);
				} else {
					this.status = Status.WARN;
					toast.dark(
						`Unexcepted error! ${contentType} element is NOT updated!`
					);
					console.log(result);
				}
			});
		} catch (error) {
			toast.error(error.message);
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
				if (defaultLayout) {
					defaultLayout.current = true;
					this.currentLang = defaultLayout.defaultLang;
				} else {
					this.currentLang = "";
				}

				this.status = Status.DONE;
			});
		} catch (error) {
			console.error(error);
			if (silent) this.status = Status.WARN;
			else this.status = Status.ERROR;
			this.message = error.message;
		}
	}

	addError(elementId, message) {
		const element = this.getElementById(elementId);
		element._error = message;
	}

	clearError(elementId) {
		const element = this.getElementById(elementId);
		if (element._error) delete element._error;
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

const layoutsStore = (window.layoutsStore = new LayoutsStore());
export default layoutsStore;
