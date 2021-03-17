import { action } from "mobx";
import { observer } from "mobx-react";
import WindowsStore from "../../../store/windows.js";

import { Window } from "../Window";

function DialogManager({ className, style, windowsStore, group = null }) {
	const winList = windowsStore.windows.filter((wnd) => wnd.group === group);
	if (winList.length === 0) return null;

	return (
		<div
			className={"windows-wrapper" + (className ? " " + className : "")}
			style={{ style }}
		>
			{winList.map((wnd, index) => {
				// const dialog = toJS(wnd);
				const DialogClass = wnd.Win[0];

				const sets = action((dialogSets) => {
					wnd.sets = { ...wnd.sets, ...dialogSets };
					wnd.sets.className = "window " + wnd.sets?.className;
				});

				const handleClose = () => {
					WindowsStore.removeWindowById(wnd.id);
				};

				return (
					<Window
						key={wnd.id}
						winId={wnd.id}
						{...wnd.sets}
						onClose={handleClose}
						style={{ zIndex: index.toString() }}
						onMinimize={action((size) => {
							wnd.sets.restoreSize = wnd.sets.size;
							wnd.sets.size = size;
						})}
						onMaximize={action((size) => {
							wnd.sets.size = size;
						})}
					>
						<DialogClass
							attr={wnd.attr}
							key={wnd.id}
							dialog={sets}
							close={handleClose}
						/>
					</Window>
				);
			})}
		</div>
	);
}

export default observer(DialogManager);
