import React from "react";

export default function Checkbox({
	className,
	style,
	inputStyle,
	name,
	label,
	tip,
	...props
}) {
	return label ? (
		<div className={className} style={style} title={tip}>
			<label htmlFor={name} style={{ whiteSpace: "nowrap" }}>
				{label}
			</label>
			<input
				className="checkbox-toggle"
				name={name}
				id={name}
				type="checkbox"
				style={inputStyle}
				{...props}
			/>
		</div>
	) : (
		<input
			className={className}
			style={style}
			name={name}
			id={name}
			type="checkbox"
			{...props}
		/>
	);
}
