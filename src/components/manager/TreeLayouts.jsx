import React, { Component } from "react";
import { observer } from "mobx-react";
import WindowsStore from "../../store/windows";
import LayoutsStore, { Status, ContentTypes } from "../../store/layouts";
import { ICON_SIZE } from "../general/SidebarMenu";

import NodeTree from "../general/NodeTree";
import NodeItem from "./NodeItem";
import { treeItems } from "./ContentType";

import Spinner from "react-spinners/DotLoader";

import {
	// option icons
	PlusCircle as IconCreateLayout,
	ArrowRepeat as IconRefresh,
	Sliders as IconLayoutProps,
	NodePlus as IconAddElement,
	ArrowBarUp as IconMoveBefore,
	ArrowBarDown as IconMoveAfter,
	Trash as IconTrash,
} from "react-bootstrap-icons";

import AddElement from "./windows/AddElement";

class TreeLayouts extends Component {
	state = {
		selected: null,
	};

	async componentDidMount() {
		// await this.getLayoutData();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.setState({ selected: null });
			this.props.setOptions([
				{
					icon: <IconCreateLayout size={ICON_SIZE} />,
					style: { marginRight: "auto" },
					title: "New layout...",
					tip: "Create new layout",
				},
				{
					icon: <IconRefresh size={ICON_SIZE} />,
					tip: "Refresh",
					onClick: () => {
						this.getLayoutData();
					},
				},
			]);
		}
	}

	async getLayoutData() {
		console.log("> Getting layouts data...");
		await LayoutsStore.fetchList(true);
	}

	openElementAdd = (item) => {
		console.log(`Create element in `, item);
		WindowsStore.addWindow("new_element", AddElement, item);
	};

	openElementProps = (item) => {
		console.log(`Property of '${item.contentType}' on ID#${item.id}...`);
		console.log(item);
		// const { parrent, childs, ...itemAttr } = item;
		const wnd = treeItems[item.contentType]?.elementProps;
		if (wnd) WindowsStore.addWindow(item._id.toString(), wnd, item);
		else {
			console.error(
				`! Class for window properties of '${item.contentType}' is not defined.`
			);
		}
	};

	doSelect = (item) => {
		const itemId = item._id.toString();
		this.setState({ selected: itemId });

		this.props.setActive();

		// update current item attributes in "New element" window, if opened.
		WindowsStore.setAttr("new_element", item);

		let parentNode = null;
		let parentNodeChilds = [];
		if (item.parrent) {
			const parentNodeId = item.parrent.toString();
			parentNode = LayoutsStore.getElementById(parentNodeId);
			parentNodeChilds = parentNode?.childs;
		}

		const itemIndex = parentNodeChilds.findIndex(
			(item) => itemId === item.toString()
		);

		this.props.setOptions([
			{
				icon: <IconAddElement size={ICON_SIZE} />,
				title: "Add",
				tip: `Add new element in '${item.contentType}' node`,
				onClick: () => this.openElementAdd(item),
			},
			{
				icon: <IconLayoutProps size={ICON_SIZE} />,
				title: "Props...",
				tip: `Edit '${item.contentType}' properties`,
				onClick: () => this.openElementProps(item),
			},
			{
				icon: <IconMoveBefore size={ICON_SIZE} />,
				tip: "Move Up",
				onClick: () => {
					LayoutsStore.moveItemInNode(item.parrent.toString(), itemIndex, -1);
					this.doSelect(item);
				},
				enabled: parentNodeChilds?.length && itemIndex > 0,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconMoveAfter size={ICON_SIZE} />,
				tip: "Move Down",
				onClick: () => {
					LayoutsStore.moveItemInNode(item.parrent.toString(), itemIndex, 1);
					this.doSelect(item);
				},
				enabled:
					parentNodeChilds?.length && itemIndex < parentNodeChilds?.length - 1,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconTrash size={ICON_SIZE} style={{ color: "#f00" }} />,
				style: { marginLeft: "auto" },
				tip: "Delete",
			},
		]);

		// if (this.state.selected === itemId) return true;
		return false;
	};

	handleOnDrop = (src, index, id) => {
		const parent = LayoutsStore.getElementById(id);
		const parentId = index !== null ? parent.parrent.toString() : id;
		const Src = JSON.parse(src);
		const newElement = Src.element;
		if (Src.src === "add-element") {
			newElement._id = new Date().getTime().toString();
		}
		LayoutsStore.insert(newElement, parentId, index);
		// console.log(JSON.parse(src), index, LayoutsStore.getElementById(parentId));
	};

	doInsertNewElement(newElement, destElementId, destChildIndex) {}

	render() {
		const _status = LayoutsStore.currentStatus;
		if (_status === Status.PENDING)
			return (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Spinner size="24px" color={"#36D7B7"} loading={true} />
				</div>
			);
		if (
			_status !== Status.DONE &&
			_status !== Status.SILENT &&
			_status !== Status.WARN
		)
			return null;

		const layoutsIds = LayoutsStore.available.map((layout) => layout._id);

		return (
			<NodeTree id="layouts-tree" visible={this.props.visible}>
				<ElementsList
					id="root"
					list={layoutsIds}
					selected={this.state.selected}
					onClick={this.doSelect}
					onDoubleClick={this.openElementProps}
					onDrop={this.handleOnDrop}
				/>
			</NodeTree>
		);
	}
}

export default observer(TreeLayouts);

const ElementsList = observer(
	({ id, list, selected, onClick, onDoubleClick, onDrop, ...props }) => {
		if (!list) {
			console.error("TreeLayouts list data is not defined.");
			return null;
		}

		if (list.length === 0) {
			return (
				<NodeItem
					key={id}
					title={"(empty node)"}
					dropOnItem={true}
					onItemDropped={(src, place) => {
						if (onDrop) onDrop(src, null, id);
					}}
				/>
			);
		}
		return list.map((id, index) => {
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
					dropBefore={element.contentType !== "layout" && index === 0}
					dropAfter={
						element.contentType !== "layout" && index <= list.length - 1
					}
					onItemDropped={(src, place) => {
						if (place === "after") index++;
						if (onDrop) onDrop(src, index, id);
						// console.log(list, index, src);
					}}
				>
					{haveChildrens && (
						<ElementsList
							id={id}
							list={element.childs}
							selected={selected}
							onClick={onClick}
							onDoubleClick={onDoubleClick}
							onDrop={onDrop}
						/>
					)}
				</NodeItem>
			);
		});
	}
);
