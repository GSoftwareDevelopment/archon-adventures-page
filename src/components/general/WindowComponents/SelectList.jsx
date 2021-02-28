import React from "react";

export default function SelectList({
	className,
	list,
	onItemRender,
	onChoice,
	...props
}) {
	const totalItems = list.length;
	return (
		<div className={"select-list " + className}>
			{list.map((listItem, index) => {
				const { isChoiced, before, item, after } = onItemRender(listItem, {
					index,
					firstItem: index === 0,
					lastItem: index === totalItems - 1,
				});

				return (
					<React.Fragment key={index}>
						{before}
						<div
							className={"list-row selectable" + (isChoiced ? " choiced" : "")}
							onClick={() => {
								if (onChoice) onChoice(listItem);
							}}
						>
							{item}
						</div>
						{after}
					</React.Fragment>
				);
			})}
		</div>
	);
}
