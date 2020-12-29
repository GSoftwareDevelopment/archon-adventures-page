import React from "react";

import * as Icon from "react-bootstrap-icons";

export default function Alert({ variant, className, onHide, ...props }) {
	return (
		<div className={className + " " + variant} {...props}>
			<button onClick={onHide}>
				<Icon.X size="16px" />
			</button>
			{props.children}
		</div>
	);
}
