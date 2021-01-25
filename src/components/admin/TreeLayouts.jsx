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
} from "react-bootstrap-icons";

import LayoutEdit from "./windows/LayoutEdit";
import { unifyPath } from "../../libs/utils";
import { Path } from "../../setup";

class TreeLayouts extends Component {
	async componentDidMount() {
		console.log("> Pending data about 'Layout'...");
		await LayoutsStore.fetchList();
	}

	handleLayoutEdit(layout) {
		const { scheme, ...onlyLayoutAttr } = layout;
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
				<div style={{ flexGrow: "2" }}>
					{layoutsList.map((layout) => {
						const id = layout._id.toString();
						const isDefault = layout.current;
						let nodeTitle = <span>{layout.name}</span>;
						if (isDefault) nodeTitle = layout.name + " (default)";
						if (id === currentLayoutId)
							nodeTitle = (
								<React.Fragment>
									{nodeTitle}
									{" (current)"}
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
				</div>
			</NodeTree>
		);
	}
}

const treeItems = {
	"menu-link": {
		icon: <IconMenuLink size="24px" />,
		title: ({ id }) => id,
	},
	"lang-selector": {
		icon: <IconLangSelector size="24px" />,
	},
	card: {
		icon: <IconCard size="24px" />,
		title: ({ name }) => "Card " + Path.DELIMITER + unifyPath(name),
	},
	calendar: {
		icon: <IconCalendar size="24px" />,
	},
	galery: {
		icon: <IconGallery size="24px" />,
	},
	comments: {
		icon: <IconComment size="24px" />,
	},
	"router-content": {
		icon: <IconRouterContent size="24px" />,
		title: ({ id }) => id,
	},
};

class ElementsList extends Component {
	editElement(element) {
		console.log(element);
	}

	render() {
		if (!this.props.source) {
			console.error("TreeLayouts component error. No source data.", this.props);
			return null;
		}

		return this.props.source.map((element, index) => {
			const haveChildrens = typeof element.elements !== "undefined";
			let icon = null;
			let title = element.contentType;

			const ES = treeItems[element.contentType];
			if (ES) {
				if (ES.icon) icon = ES.icon;
				if (ES.title) title = ES.title(element);
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
