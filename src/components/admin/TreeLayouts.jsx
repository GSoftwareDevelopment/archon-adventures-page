import React, { Component } from "react";
import { observer } from "mobx-react";
import WindowsStore from "./store/windows";
import LayoutsStore, { Status, ContentTypes } from "../../store/layouts";

import NodeTree from "./NodeTree";
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

class TreeLayouts extends Component {
	state = {
		selected: null,
	};

	async componentDidMount() {
		await this.getLayoutData();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.visible && this.props.visible) {
			this.setState({ selected: null });
			this.props.setOptions([
				{
					icon: <IconCreateLayout size="20px" />,
					style: { marginRight: "auto" },
					title: "New layout...",
					tip: "Create new layout",
				},
				{
					icon: <IconRefresh size="20px" />,
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
		await LayoutsStore.fetchList();
	}

	openElementProps = (item) => {
		console.log(`Property of '${item.contentType}' on ID#${item.id}...`);
		console.log(item);
		const { parrent, childs, ...itemAttr } = item;
		const wnd = treeItems[item.contentType]?.elementProps;
		if (wnd) WindowsStore.addWindow(item._id.toString(), wnd, itemAttr);
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
				icon: <IconAddElement size="20px" />,
				title: "Add",
				tip: `Add new element in '${item.contentType}' node`,
			},
			{
				icon: <IconLayoutProps size="20px" />,
				title: "Props...",
				tip: `Edit '${item.contentType}' properties`,
				onClick: () => this.openElementProps(item),
			},
			{
				icon: <IconMoveBefore size="20px" />,
				tip: "Move Up",
				onClick: () => {
					LayoutsStore.moveItemInNode(item.parrent.toString(), itemIndex, -1);
					this.doSelect(item);
				},
				enabled: parentNodeChilds?.length && itemIndex > 0,
				visible: item.contentType !== ContentTypes.LAYOUT,
			},
			{
				icon: <IconMoveAfter size="20px" />,
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
				icon: <IconTrash size="20px" style={{ color: "#f00" }} />,
				style: { marginLeft: "auto" },
				tip: "Delete",
			},
		]);

		if (this.state.selected === itemId) return true;
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
		if (!list) {
			console.error("TreeLayouts list data is not defined.");
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
