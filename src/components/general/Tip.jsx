import "rc-tooltip/assets/bootstrap.css";
import "../../scss/tip.scss";
import React from "react";
import Tooltip from "rc-tooltip";

import { InfoCircle as IconHelp } from "react-bootstrap-icons";
import MarkdownView from "react-showdown";

// let tipId;

export default function Tip({ title, content }) {
	// tipId = React.useRef(null);

	const tipText = (
		<div className="tip">
			<div className="tip-header">
				<IconHelp size="2em" />
				<div className="tip-title">{title || "Information Tip"}</div>
			</div>
			<MarkdownView className="tip-content" markdown={content} />
		</div>
	);

	return (
		<Tooltip
			placement="bottom"
			trigger={["click"]}
			overlay={tipText}
			destroyTooltipOnHide={{ keepParent: false }}
		>
			<span className="tip-button">
				<IconHelp />
			</span>
		</Tooltip>
	);
}

/*
		<span
			className="tip-button"
			onClick={(e) => {
				if (tipId.current) toast.dismiss(tipId.current);
				tipId.current = toast.dark(
					<div className="tip">
						<div className="tip-header">
							<IconHelp size="2em" />
							<div className="tip-title">{title || "Information Tip"}</div>
						</div>
						<MarkdownView className="tip-content" markdown={content} />
						<div className="tip-footer">Click on tip to close</div>
					</div>,
					{
						position: "top-center",
						autoClose: false,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						closeButton: false,
					}
				);
			}}
		>
			<IconHelp />
		</span>
*/
