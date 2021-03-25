import React, { Component } from "react";
import { observer } from "mobx-react";
import WindowsStore from "../../store/windows";
import LayoutsStore, { Status, ContentTypes } from "../../store/layouts";
import { ICON_SIZE } from "../general/SidebarMenu";

import NodeTree from "../general/NodeTree";
import NodeItem from "./NodeItem";
import { contentTypeItems } from "./ContentType";

import Spinner from "react-spinners/DotLoader";

import {
	// option icons
	PlusCircle as IconCreateLayout,
	ArrowRepeat as IconRefresh,
	Sliders as IconLayoutProps,
	PlusCircleDotted as IconAddElement,
	ArrowBarUp as IconMoveBefore,
	ArrowBarDown as IconMoveAfter,
	Trash as IconTrash,
	ExclamationTriangleFill as IconError,
} from "react-bootstrap-icons";

import AddElement from "./windows/AddElement";
import DeleteConfirmation from "./windows/DeleteConfirmation";

import * as Messages from "../../libs/Messages";
const msg_base = "manager.layouts.options";

class TreeLayouts extends Component {
	state = {
		selected: null,
	};

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.setState({ selected: null });
			this.props.setOptions([
				{
					icon: <IconCreateLayout size={ICON_SIZE} />,
					style: { marginRight: "auto" },
					title: Messages.getText(`${msg_base}.newLayout`),
					tip: Messages.getText(`${msg_base}.newLayout.tip`),
				},
				{
					icon: <IconRefresh size={ICON_SIZE} />,
					title: Messages.getText(`${msg_base}.refresh`),
					tip: Messages.getText(`${msg_base}.refresh.tip`),
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
		const wnd = contentTypeItems[item.contentType]?.elementProps;
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
				title: Messages.getText(`${msg_base}.addElement`),
				tip: Messages.getText(`${msg_base}.addElement.tip`),
				onClick: () => this.openElementAdd(item),
			},
			{
				icon: <IconLayoutProps size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.propertiesElement`),
				tip: Messages.getText(`${msg_base}.propertiesElement.tip`),
				onClick: () => this.openElementProps(item),
				enabled: Boolean(contentTypeItems[item.contentType]?.elementProps),
			},
			{
				icon: <IconMoveBefore size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.moveItemUp`),
				tip: Messages.getText(`${msg_base}.moveItemUp.tip`),
				onClick: () => {
					LayoutsStore.moveElementInNode(
						item.parrent.toString(),
						itemIndex,
						-1
					);
					this.doSelect(item);
				},
				enabled: parentNodeChilds?.length && itemIndex > 0,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconMoveAfter size={ICON_SIZE} />,
				title: Messages.getText(`${msg_base}.moveItemDown`),
				tip: Messages.getText(`${msg_base}.moveItemDown.tip`),
				onClick: () => {
					LayoutsStore.moveElementInNode(item.parrent.toString(), itemIndex, 1);
					this.doSelect(item);
				},
				enabled:
					parentNodeChilds?.length && itemIndex < parentNodeChilds?.length - 1,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconTrash size={ICON_SIZE} style={{ color: "#f00" }} />,
				style: { marginLeft: "auto" },
				title: Messages.getText(`${msg_base}.deleteElement`),
				tip: Messages.getText(`${msg_base}.deleteElement.tip`),
				onClick: () => {
					this.handleDeleteElementConfirm(item);
				},
			},
		]);

		// if (this.state.selected === itemId) return true;
		return false;
	};

	handleOnDrop = async (src, index, id) => {
		const parent = LayoutsStore.getElementById(id);
		const parentId = index !== null ? parent.parrent.toString() : id;
		const Src = JSON.parse(src);
		const newElement = Src.element;
		newElement.parrent = parentId;

		if (Src.src === "add-element") {
			await LayoutsStore.insertElement(newElement, parentId, index);
		}
	};

	doInsertNewElement(newElement, destElementId, destChildIndex) {}

	doDeleteElement(item) {
		LayoutsStore.deleteElement(item._id.toString());
		return true;
	}

	handleDeleteElementConfirm(item) {
		const { contentType } = item;
		let message = contentType.toUpperCase();

		const ES = contentTypeItems[contentType];
		if (ES?.title) message = message + " " + ES.title(item);

		WindowsStore.addWindow(
			"delete-element",
			DeleteConfirmation,
			{
				item: message,
				actions: [
					// TODO:	Niepodoba mi się ta forma definicji akcji :/
					() => this.doDeleteElement(item),
				],
			},
			"sidebar"
		);
	}

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
		const errorElements = LayoutsStore.elements
			.filter((element) => element._error)
			.map(({ _id, _error }) => _id);
		const heapError = [];
		if (errorElements.length) {
			while (errorElements.length > 0) {
				const elementId = errorElements.pop();
				const element = LayoutsStore.getElementById(elementId);
				if (element.parrent) {
					const parentId = element.parrent.toString();
					heapError.push(parentId);
					errorElements.push(parentId);
				}
			}
		}

		return (
			<NodeTree id="layouts-tree" visible={this.props.visible}>
				<ElementsList
					id="root"
					list={layoutsIds}
					selected={this.state.selected}
					onClick={this.doSelect}
					onDoubleClick={this.openElementProps}
					onDrop={this.handleOnDrop}
					heapError={heapError}
				/>
			</NodeTree>
		);
	}
}

export default observer(TreeLayouts);

const ElementsList = observer(
	({
		id,
		list,
		selected,
		onClick,
		onDoubleClick,
		onDrop,
		heapError,
		...props
	}) => {
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

			const ES = contentTypeItems[element.contentType];
			if (ES) {
				if (ES.Icon) icon = <ES.Icon className="icon-overlay" />;
				if (ES.title) title = ES.title(element);
			}

			const errorInChilds = heapError.includes(id);
			let _error = null;
			if (element._error || errorInChilds) {
				_error = (
					<React.Fragment>
						<IconError style={{ marginLeft: "auto", color: "#f00" }} />
					</React.Fragment>
				);
			}

			return (
				<NodeItem
					key={id}
					icon={icon}
					title={title}
					extra={_error}
					selected={selected === id}
					onClick={() => {
						if (onClick) return onClick(element);
					}}
					onDoubleClick={() => {
						if (onDoubleClick) onDoubleClick(element);
					}}
					dropBefore={element.contentType !== "layout"}
					dropAfter={
						element.contentType !== "layout" && index === list.length - 1
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
							heapError={heapError}
						/>
					)}
				</NodeItem>
			);
		});
	}
);
