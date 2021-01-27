import { action, computed, makeObservable, observable } from "mobx";

class WindowsStore {
	windowsList = [];

	constructor() {
		makeObservable(this, {
			windowsList: observable,
			addWindow: action,
			removeWindowById: action,
			windows: computed,
		});
	}

	addWindow(uniqueId, component, props) {
		this.windowsList.push({ id: uniqueId, Win: [component], props });
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
