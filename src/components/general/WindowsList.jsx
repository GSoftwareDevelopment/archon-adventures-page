import { action } from "mobx";
import { observer } from "mobx-react";
import WindowsStore from "../../store/windows.js";

import Window from "./Window";
import { X as IconClose } from "react-bootstrap-icons";

export const WindowsManager = ({ windows }) => {
	const winList = windows;
	return (
		<div className="windows-wrapper inner-windows align-windows-column">
			{winList
				.map((wnd, index) => {
					if (!wnd.sets) return null;

					const title = wnd.sets.title;
					return (
						<div key={wnd.id} className="window-header">
							<button
								onClick={(e) => {
									WindowsStore.removeWindowById(wnd.id);
								}}
							>
								<IconClose />
							</button>
							<button
								className="no-focus"
								style={{ flexGrow: "2" }}
								onClick={action(() => {
									WindowsStore.bringToFront(wnd.id);
									if (wnd.sets.restoreSize)
										wnd.sets.size = wnd.sets.restoreSize;
								})}
								title={title}
							>
								{title}
							</button>
						</div>
					);
				})
				.reverse()}
		</div>
	);
};

//

const WindowsList = ({ className, windowsStore, group = null }) => {
	const winList = windowsStore.windows.filter((wnd) => wnd.group === group);
	if (winList.length === 0) return null;

	return (
		<div className={"windows-wrapper" + (className ? " " + className : "")}>
			{winList.map((wnd, index) => {
				// const dialog = toJS(wnd);
				const Dialog = wnd.Win[0];
				const sets = action((dialogSets) => {
					wnd.sets = dialogSets;
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
						<Dialog
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
};

export default observer(WindowsList);
