import React from "react";

/**
 *
 * @typedef {Object} InputPropsInterface
 * @property {string} [className] - Class string definition
 * @property {React.CSSProperties} [style] styles for main wrapper
 * @property {React.CSSProperties} [inputStyle] styles for inner input tag
 * @property {string} type - Element <input type="..." /> attribute
 * @property {string} [name] - Element <input name="..." /> attribute
 * @property {string} [label] - Element label
 * @property {boolean} [noWrapLabel] - if set, the label text will not wrap
 * @property {string} [tip] - Tooltip message
 * @property {object} [props] - Props for <input> element
 */
/**
 * Show input element with associated label (if exists)
 * @param {InputPropsInterface} param0 Component props
 */
export default function Input({
	className,
	style,
	inputStyle,
	type,
	name,
	label,
	noWrapLabel,
	tip,
	...props
}) {
	return label ? (
		<div className={className} style={style} title={tip}>
			<label
				htmlFor={name}
				style={{ whiteSpace: noWrapLabel ? "nowrap" : "normal" }}
			>
				{label}
			</label>
			<input
				name={name}
				id={name}
				type={type}
				autoComplete="off"
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
			type={type}
			autoComplete="off"
			{...props}
		/>
	);
}
