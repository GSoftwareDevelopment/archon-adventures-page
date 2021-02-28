import React from "react";

/**
 * Interface of element for array of button or components list in ButtonsGroupInterface
 * @typedef {object} ButtonsInterface
 * @property {JSX.Element} [component] Component to display in group (have priority if defined)
 * @property {JSX.Element} [icon] Icon component to display in left side of button
 * @property {string} [className] Class string definition
 * @property {React.CSSProperties} [style]
 * @property {string} [title] Button title
 * @property {string} [tip] Tooltip for button or component
 * @property {boolean} [enabled=true] Activity of element in group
 * @property {boolean} [visible=true] Visibility of element in group
 * @property {function} [onClick] Event function on mouse click
 */
/**
 * Interface of ButtonsGroup component props
 * @typedef {object} ButtonsGroupPropsInterface
 * @property {string} [className] Class string definition
 * @property {React.CSSProperties} [style]
 * @property {boolean} [onlyIcons] Show only icons (if available)
 * @property {...ButtonsInterface} buttons Array of buttons or components list
 */
/**
 * Show buttons or components in group
 * @param {ButtonsGroupPropsInterface} param0 Component props
 */
export default function ButtonsGroup({
	className,
	style,
	onlyIcons,
	iconAlign,
	buttons,
}) {
	const alignIconRight = iconAlign && iconAlign === "right";
	const alignClass = alignIconRight ? " button-align-right" : "";

	return (
		<div className={className} style={style}>
			{buttons.map((btn: ButtonsInterface, index) => {
				if (typeof btn.visible === "boolean" && !btn.visible) return null;
				let title = undefined;
				if (typeof btn.title === "string") {
					title = btn.title.trim();
				}
				if (btn.component) {
					return (
						<div
							key={index}
							className={btn.className}
							style={btn.style}
							disabled={typeof btn.enabled === "boolean" ? !btn.enabled : false}
							title={btn.tip || title}
						>
							{btn.component}
						</div>
					);
				} else
					return (
						<button
							key={index}
							onClick={(e) => {
								e.preventDefault();
								if (btn.onClick) btn.onClick(e);
							}}
							disabled={typeof btn.enabled === "boolean" ? !btn.enabled : false}
							className={btn.className + alignClass}
							style={btn.style}
							title={Boolean(onlyIcons) ? btn.tip || title : btn.tip}
						>
							{!alignIconRight && btn.icon}
							{!Boolean(onlyIcons) && Boolean(title) && (
								<span style={{ marginLeft: "5px" }}>{title}</span>
							)}
							{alignIconRight && btn.icon}
						</button>
					);
			})}
		</div>
	);
}
