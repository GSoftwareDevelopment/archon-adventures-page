// import { toJS } from "mobx";
import { observer } from "mobx-react";
import WindowsStore from "../../store/windows.js";

const WindowsList = ({ windowsStore }) => {
	return windowsStore.windows.map((wnd) => {
		// const dialog = toJS(wnd);
		const Dialog = wnd.Win[0];
		return (
			<Dialog
				attr={wnd.attr}
				key={wnd.id}
				onClose={() => {
					WindowsStore.removeWindowById(wnd.id);
				}}
			/>
		);
	});
};

export default observer(WindowsList);
