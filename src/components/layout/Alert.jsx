import React from "react";

import { X as HideIcon } from "react-bootstrap-icons";

export default function Alert({ variant, className, onHide, ...props }) {
	return (
		<div className={className + " " + variant} {...props}>
			{onHide && (
				<button className="close" onClick={onHide}>
					<HideIcon size="16px" />
				</button>
			)}
			{props.children}
		</div>
	);
}
