/*
		This code has taken from https://github.com/ChrisDobby/react-drag-drop-demo
*/

import React from "react";
import PropTypes from "prop-types";
import * as dropEffects from "./dropEffects";

const DropTarget = (props) => {
	const [isOver, setIsOver] = React.useState(false);

	const dragOver = (ev) => {
		ev.preventDefault();
		ev.dataTransfer.dropEffect = props.dropEffect;
	};

	const drop = (ev) => {
		const droppedItem = ev.dataTransfer.getData("drag-item");
		if (droppedItem) {
			props.onItemDropped(droppedItem);
		}
		setIsOver(false);
	};

	const dragEnter = (ev) => {
		ev.dataTransfer.dropEffect = props.dropEffect;
		setIsOver(true);
	};

	const dragLeave = () => setIsOver(false);

	return (
		<div
			onDragOver={dragOver}
			onDrop={drop}
			onDragEnter={dragEnter}
			onDragLeave={dragLeave}
			className={
				(props.className ? props.className : "") + (isOver ? " hover" : "")
			}
			style={props.style}
		>
			{props.children}
		</div>
	);
};

DropTarget.propTypes = {
	onItemDropped: PropTypes.func.isRequired,
	dropEffect: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
};

DropTarget.defaultProps = {
	dropEffect: dropEffects.All,
};

export default DropTarget;
