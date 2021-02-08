import { observer } from "mobx-react";
import WindowsStore from "../../store/windows.js";

const WindowsList = ({ windowsStore }) => {
	return windowsStore.windows.map((wnd) => {
		const Win = wnd.Win[0];
		return (
			<Win
				{...wnd.props}
				key={wnd.id}
				onClose={() => {
					WindowsStore.removeWindowById(wnd.id);
				}}
			/>
		);
	});
};

export default observer(WindowsList);
