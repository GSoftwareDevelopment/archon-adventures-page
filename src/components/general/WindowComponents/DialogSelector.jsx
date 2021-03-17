import { action } from "mobx";
import WindowsStore from "../../../store/windows.js";

import { X as IconClose } from "react-bootstrap-icons";

export default function DialogSelector({ windows }) {
	const winList = windows;
	return (
		<div className="windows-wrapper align-windows-column inner-windows">
			{winList
				.map((wnd, index) => {
					if (!wnd.sets) return null;

					const title = wnd.sets.title;
					return (
						<div key={wnd.id} className="window-header">
							<div>
								<button
									onClick={(e) => {
										WindowsStore.removeWindowById(wnd.id);
									}}
								>
									<IconClose />
								</button>
							</div>
							<span>
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
							</span>
						</div>
					);
				})
				.reverse()}
		</div>
	);
}
