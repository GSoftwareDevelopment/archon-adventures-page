import React, { Component } from "react";
import { observer } from "mobx-react";
import WindowsStore from "./store/windows";
import LayoutsStore, { status } from "./store/layouts";

import NodeTree from "./NodeTree";
import NodeItem from "./NodeItem";

import Spinner from "react-spinners/DotLoader";

import {
	BroadcastPin as IconRouterContent,
	Broadcast as IconMenuLink,
	List as IconLangSelector,
	JournalRichtext as IconCard,
	Calendar3 as IconCalendar,
	JournalAlbum as IconGallery,
	ChatRight as IconComment,
	Check2 as IconCurrent,
} from "react-bootstrap-icons";

import LayoutEdit from "./windows/LayoutEdit";

class TreeLayouts extends Component {
	async componentDidMount() {
		console.log("> Pending data about 'Layout'...");
		await LayoutsStore.fetchList();
	}

	handleLayoutEdit(layout) {
		const { scheme, ...onlyLayoutAttr } = layout;
		console.log(onlyLayoutAttr);
		WindowsStore.addWindow(layout._id.toString(), LayoutEdit, onlyLayoutAttr);
		this.props.onOpenWindow();
	}

	render() {
		const _status = LayoutsStore.currentStatus;
		if (_status === status.PENDING)
			return (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Spinner size="24px" color={"#36D7B7"} loading={true} />
				</div>
			);
		if (_status !== status.DONE) return null;

		const layoutsList = LayoutsStore.available;
		const currentLayoutId = LayoutsStore.current._id.toString();

		return (
			<NodeTree id="layouts-tree" visible={this.props.visible}>
				{layoutsList.map((layout) => {
					const id = layout._id.toString();
					const isDefault = layout.current;
					let nodeTitle = <span>{layout.name}</span>;
					if (isDefault)
						nodeTitle = (
							<span style={{ fontWeight: "bold" }}>{layout.name}</span>
						);
					if (id === currentLayoutId)
						nodeTitle = (
							<React.Fragment>
								<IconCurrent />
								{nodeTitle}
							</React.Fragment>
						);

					return (
						<NodeItem
							key={id}
							title={nodeTitle}
							onDoubleClick={() => {
								this.handleLayoutEdit(layout);
							}}
						>
							<ElementsList source={layout.scheme} />
						</NodeItem>
					);
				})}
			</NodeTree>
		);
	}
}

class ElementsList extends Component {
	editElement(element) {
		console.log(element);
	}

	render() {
		if (!this.props.source) {
			return <div>Node error</div>;
		}

		return this.props.source.map((element, index) => {
			const haveChildrens = typeof element.elements !== "undefined";
			let icon;
			let title = element.contentType;

			switch (element.contentType) {
				case "menu-link":
					icon = <IconMenuLink />;
					title = element.id; // + " " + title;
					break;
				case "lang-selector":
					icon = <IconLangSelector />;
					break;
				case "card":
					icon = <IconCard />;
					break;
				case "calendar":
					icon = <IconCalendar />;
					break;
				case "galery":
					icon = <IconGallery />;
					break;
				case "comments":
					icon = <IconComment />;
					break;
				case "router-content":
					icon = <IconRouterContent />;
					title = element.id;
					break;
				default:
					icon = null;
			}

			return (
				<NodeItem
					key={index}
					icon={icon}
					title={title}
					onDoubleClick={() => {
						this.editElement(element);
					}}
				>
					{haveChildrens && <ElementsList source={element.elements} />}
				</NodeItem>
			);
		});
	}
}

export default observer(TreeLayouts);
