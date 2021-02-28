import { action, computed, makeObservable, observable } from "mobx";

class WindowsStore {
	windowsList = [];

	constructor() {
		makeObservable(this, {
			windowsList: observable,
			bringToFront: action,
			addWindow: action,
			setAttr: action,
			removeWindowById: action,
			windows: computed,
		});
	}

	bringToFront(id) {
		const index = this.windowsList.findIndex((w) => w.id === id);
		let wnd = this.windowsList[index];
		if (index !== -1) {
			this.windowsList.splice(index, 1);
		}
		this.windowsList.push(wnd);
	}

	addWindow(uniqueId, Component, attr, group = null) {
		// debugger;
		// const dialog = <Component />;
		const index = this.windowsList.findIndex((w) => w.id === uniqueId);
		let sets = this.windowsList[index]?.sets;
		if (index !== -1) {
			this.windowsList.splice(index, 1);
		}
		if (sets?.restoreSize) sets.size = sets.restoreSize;
		this.windowsList.push({
			id: uniqueId,
			Win: [Component],
			attr,
			group,
			sets,
		});
	}

	setAttr(windowId, newAttr) {
		const wnd = this.windowsList.find((w) => w.id === windowId);
		if (wnd) {
			wnd.attr = newAttr;
		}
	}

	removeWindowById(wndId) {
		const wndIndex = this.windowsList.findIndex((wnd) => wnd.id === wndId);
		if (wndIndex > -1) {
			this.windowsList.splice(wndIndex, 1);
			this.windowsList
				.filter((wnd) => wnd.group === wndId)
				.forEach((wnd) => {
					this.removeWindowById(wnd.id);
				});
		}
	}

	get windows() {
		return this.windowsList;
	}
}

const windowsStore = (window.windowsStore = new WindowsStore());

export default windowsStore;
