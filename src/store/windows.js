import { action, computed, makeObservable, observable } from "mobx";

class WindowsStore {
	windowsList = [];

	constructor() {
		makeObservable(this, {
			windowsList: observable,
			addWindow: action,
			setAttr: action,
			removeWindowById: action,
			windows: computed,
		});
	}

	addWindow(uniqueId, component, attr) {
		const index = this.windowsList.findIndex((w) => w.id === uniqueId);
		if (index === -1)
			this.windowsList.push({ id: uniqueId, Win: [component], attr });
		else this.windowsList[index] = { id: uniqueId, Win: [component], attr };
	}

	setAttr(windowId, newAttr) {
		const wnd = this.windowsList.find((w) => w.id === windowId);
		if (wnd) {
			wnd.attr = newAttr;
		}
	}

	removeWindowById(wndId) {
		const wndIndex = this.windowsList.findIndex((wnd) => wnd.id === wndId);
		if (wndIndex > -1) this.windowsList.splice(wndIndex, 1);
	}

	get windows() {
		return this.windowsList;
	}
}

const windowsStore = (window.windowsStore = new WindowsStore());

export default windowsStore;
