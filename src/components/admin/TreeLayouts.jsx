import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import WindowsStore from "./store/windows";
import LayoutsStore, { Status, ContentTypes } from "./store/layouts";

import NodeTree from "./NodeTree";
import NodeItem from "./NodeItem";

import Spinner from "react-spinners/DotLoader";

import {
	Link45deg as IconRouterContent,
	Link as IconMenuLink,
	List as IconLangSelector,
	JournalRichtext as IconCard,
	Calendar3 as IconCalendar,
	JournalAlbum as IconGallery,
	ChatRight as IconComment,
	//
	PlusCircle as IconCreateLayout,
	Sliders as IconLayoutProps,
	NodePlus as IconAddElement,
	ArrowBarUp as IconMoveBefore,
	ArrowBarDown as IconMoveAfter,
	Trash as IconTrash,
} from "react-bootstrap-icons";

import PropsOfLayout from "./windows/PropsOfLayout";
import { unifyPath } from "../../libs/utils";
import { Path } from "../../setup";

class TreeLayouts extends Component {
	state = {
		selected: null,
	};

	async componentDidMount() {
		console.log("> Getting layouts list...");
		await LayoutsStore.fetchList();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.setState({ selected: null });
			this.props.setOptions([
				{
					icon: <IconCreateLayout size="20px" />,
					style: { marginRight: "auto" },
					title: "Create new layout",
				},
			]);
		}
		console.log("TreeLayout update...");
	}

	openLayoutEdit(layout) {
		const { scheme, ...onlyLayoutAttr } = layout;
		WindowsStore.addWindow(
			layout._id.toString(),
			PropsOfLayout,
			onlyLayoutAttr
		);
		// this.props.onOpenWindow();
	}

	openElementProps = (item) => {
		console.log(`Property of '${item.contentType}' on ID#${item.id}...`);
	};

	doSelect = (item) => {
		const itemId = item._id.toString();
		this.setState({ selected: itemId });

		this.props.setActive();

		let nodeChilds = [];
		if (item.parrent) {
			const parentNodeId = item.parrent.toString();
			nodeChilds = LayoutsStore.getElementById(parentNodeId)?.childs;
		}

		const itemIndex = nodeChilds.findIndex(
			(item) => itemId === item.toString()
		);

		this.props.setOptions([
			{
				icon: <IconLayoutProps size="20px" />,
				title: "Properties",
				onClick: () => this.openElementProps(item),
			},
			{
				icon: <IconAddElement size="20px" />,
				title: "Add",
			},
			{
				icon: <IconMoveBefore size="20px" />,
				title: "Move Up",
				onClick: () => {
					LayoutsStore.moveItemInNode(item.parrent.toString(), itemIndex, -1);
					this.doSelect(item);
				},
				enabled: nodeChilds?.length && itemIndex > 0,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconMoveAfter size="20px" />,
				title: "Move Down",
				onClick: () => {
					LayoutsStore.moveItemInNode(item.parrent.toString(), itemIndex, 1);
					this.doSelect(item);
				},
				enabled: nodeChilds?.length && itemIndex < nodeChilds?.length - 1,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconTrash size="20px" style={{ color: "#f00" }} />,
				style: { marginLeft: "auto" },
				title: "Delete",
			},
		]);

		if (this.state.selected === itemId) return true;
		// console.log(item);
	};

	render() {
		const _status = LayoutsStore.currentStatus;
		if (_status === Status.PENDING)
			return (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Spinner size="24px" color={"#36D7B7"} loading={true} />
				</div>
			);
		if (_status !== Status.DONE) return null;

		const layoutsIds = LayoutsStore.available.map((layout) => layout._id);

		return (
			<NodeTree id="layouts-tree" visible={this.props.visible}>
				<ElementsList
					id="root"
					list={layoutsIds}
					selected={this.state.selected}
					onClick={this.doSelect}
					onDoubleClick={this.openElementProps}
				/>
			</NodeTree>
		);
	}
}

export default observer(TreeLayouts);

const ElementsList = observer(
	({ id, list, selected, onClick, onDoubleClick, ...props }) => {
		useEffect(() => {
			console.log(id);
		});
		if (!list) {
			console.error("TreeLayouts component error. No source data.", this.props);
			return null;
		}

		return list.map((id) => {
			id = id.toString();
			const element = LayoutsStore.getElementById(id);
			if (!element) {
				console.error(`! Element #${id} can't be found`);
				return null;
			}

			const haveChildrens = typeof element.childs !== "undefined";
			let icon = null;
			let title = element.contentType;

			const ES = treeItems[element.contentType];
			if (ES) {
				if (ES.icon) icon = ES.icon;
				if (ES.title) title = ES.title(element);
			}

			return (
				<NodeItem
					key={id}
					icon={icon}
					title={title}
					selected={selected === id}
					onClick={() => {
						if (onClick) return onClick(element);
					}}
					onDoubleClick={() => {
						if (onDoubleClick) onDoubleClick(element);
					}}
				>
					{haveChildrens && (
						<ElementsList
							id={id}
							list={element.childs}
							selected={selected}
							onClick={onClick}
							onDoubleClick={onDoubleClick}
						/>
					)}
				</NodeItem>
			);
		});
	}
);

// class ElementsList extends Component {
// 	render() {
// 		if (!this.props.list) {
// 			console.error("TreeLayouts component error. No source data.", this.props);
// 			return null;
// 		}
// 		return this.props.list.map((id) => {
// 			id = id.toString();
// 			const element = LayoutsStore.getElementById(id);
// 			if (!element) {
// 				console.error(`! Element #${id} can't be found`);
// 				return null;
// 			}

// 			const haveChildrens = typeof element.childs !== "undefined";
// 			let icon = null;
// 			let title = element.contentType;

// 			const ES = treeItems[element.contentType];
// 			if (ES) {
// 				if (ES.icon) icon = ES.icon;
// 				if (ES.title) title = ES.title(element);
// 			}

// 			return (
// 				<NodeItem
// 					key={id}
// 					icon={icon}
// 					title={title}
// 					selected={this.props.selected === id}
// 					onClick={() => {
// 						if (this.props.onClick) this.props.onClick(element);
// 					}}
// 					onDoubleClick={() => {
// 						if (this.props.onDoubleClick) this.props.onDoubleClick(element);
// 					}}
// 				>
// 					{haveChildrens && (
// 						<ElementsList
// 							id={id}
// 							list={element.childs}
// 							selected={this.props.selected}
// 							onClick={this.props.onClick}
// 							onDoubleClick={this.props.onDoubleClick}
// 						/>
// 					)}
// 				</NodeItem>
// 			);
// 		});
// 	}
// }

//

const SIZE_PROP = "20px";
const treeItems = {
	layout: {
		icon: null,
		title: ({ name }) => <div style={{ fontWeight: "bold" }}>{name}</div>,
	},
	"menu-link": {
		icon: <IconMenuLink size={SIZE_PROP} />,
		title: ({ id }) => <div style={{ fontStyle: "italic" }}>{id}</div>,
	},
	"lang-selector": {
		icon: <IconLangSelector size={SIZE_PROP} />,
	},
	card: {
		icon: <IconCard size={SIZE_PROP} />,
		title: ({ name }) => (
			<div>
				Card{" "}
				<span style={{ fontStyle: "italic" }}>
					{Path.DELIMITER + unifyPath(name)}
				</span>
			</div>
		),
	},
	calendar: {
		icon: <IconCalendar size={SIZE_PROP} />,
	},
	galery: {
		icon: <IconGallery size={SIZE_PROP} />,
	},
	comments: {
		icon: <IconComment size={SIZE_PROP} />,
	},
	"router-content": {
		icon: <IconRouterContent size={SIZE_PROP} />,
		title: ({ id }) => <span style={{ fontStyle: "italic" }}>{id}</span>,
	},
};
