import "../scss/add-element.scss";

import React, { Component, useState } from "react";
import * as Messages from "../../../libs/Messages.js";
import { ContentTypes } from "../../../store/layouts";

import Window, { ButtonsGroup, SelectList } from "../../general/Window";
import * as Icon from "react-bootstrap-icons";
import Drag from "../../general/Drag";
import MarkdownView from "react-showdown";
import CustomScrollbar from "../../layout/CustomScrollbar";

export default class AddElement extends Component {
	state = {
		choicedElement: "",
	};

	onChoiceElement = (choicedElement) => {
		this.setState({ choicedElement });
	};

	render() {
		const attr = this.props.attr;
		const nodeName = attr.contentType.toUpperCase();
		return (
			<Window
				className="window window-add-element max-height"
				size="panel"
				sizeCycle={["maximized", "panel"]}
				title={`Add element '${nodeName}'`}
				onClose={this.props.onClose}
			>
				<MarkdownView
					className="info"
					markdown={Messages.getText("window.newElement.info")}
				/>
				<div style={{ flexGrow: "2", minHeight: "200px" }}>
					<CustomScrollbar>
						<ElementsList
							title="Elements"
							items={[...blockElements, ...contentElements]}
							choiced={this.state.choicedElement}
							onChoice={this.onChoiceElement}
						/>
					</CustomScrollbar>
				</div>
				<fieldset
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						justifyContent: "flex-end",
						alignItems: "center",
					}}
				>
					<ButtonsGroup
						className="group-button"
						onlyIcons={true}
						buttons={[
							{
								icon: <Icon.BoxArrowUp size="1.5em" />,
								tip: "Add item before node",
							},
							{
								icon: <Icon.BoxArrowDown size="1.5em" />,
								tip: "Add item after node",
							},
							{
								icon: <Icon.BoxArrowInDown size="1.5em" />,
								tip: "Insert item inside node as first",
							},
							{
								icon: <Icon.BoxArrowInUp size="1.5em" />,
								tip: "Insert item inside node as last",
							},
						]}
					/>
				</fieldset>
			</Window>
		);
	}
}

function ElementsList({ title, items, choiced = "", onChoice }) {
	const [selected, setSelected] = useState(choiced);

	let prevGroup = "";

	const handleRenderItem = ({ group, name, icon, title, defaultNew }, attr) => {
		let groupComponent = null;
		if (group !== prevGroup) {
			groupComponent = <legend>{group}</legend>;
		}

		prevGroup = group;
		return {
			isChoiced: selected === name,
			before: groupComponent,
			item: (
				<Drag
					dataItem={JSON.stringify({
						src: "add-element",
						element: { contentType: name, ...defaultNew },
					})}
					dropEffect="copy"
				>
					{icon}
					<span className="name">{title}</span>
				</Drag>
			),
		};
	};

	const handleChoice = ({ name }) => {
		setSelected(name);
		if (onChoice) onChoice(name);
	};

	return (
		<SelectList
			list={items}
			onItemRender={handleRenderItem}
			onChoice={handleChoice}
		/>
	);
}

//

const blockElements = [
	{
		group: "Block elements",
		name: ContentTypes.HEADER,
		title: "Header",
		icon: <Icon.Window size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: "Block elements",
		name: ContentTypes.MENUROUTER,
		title: "Menu router",
		icon: <Icon.MenuApp size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: "Block elements",
		name: ContentTypes.ROUTERCONTENT,
		title: "Route content",
		icon: <Icon.Link45deg size="64px" />,
		defaultNew: {
			exact: true,
			path: "",
			id: "",
			options: {
				useLayout: "",
			},
			childs: [],
		},
	},
	{
		group: "Block elements",
		name: ContentTypes.ROW,
		title: "Row",
		icon: <Icon.ViewList size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: "Block elements",
		name: ContentTypes.FOOTER,
		title: "Footer",
		icon: <Icon.WindowDock size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
];

const contentElements = [
	{
		group: "Content elements",
		name: ContentTypes.MENULINK,
		title: "Menu item",
		icon: <Icon.Link size="64px" />,
		defaultNew: {
			id: "",
			title: {},
		},
	},
	{
		group: "Content elements",
		name: ContentTypes.LANGSELECTOR,
		title: "Menu Language selector",
		icon: <Icon.List size="64px" />,
	},
	{
		group: "Content elements",
		name: ContentTypes.CARD,
		title: "Card",
		icon: <Icon.JournalRichtext size="64px" />,
		defaultNew: {
			name: "",
			options: {
				noLangWarnings: true,
				useMarkdown: true,
			},
			childs: [],
		},
	},
	{
		group: "Content elements",
		name: ContentTypes.GALERY,
		title: "Gallery",
		icon: <Icon.JournalAlbum size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: "Content elements",
		name: ContentTypes.CALENDAR,
		title: "Calendar (Blog)",
		icon: <Icon.Calendar3 size="64px" />,
		defaultNew: {
			path: "",
			options: {
				pagination: false,
				limit: 0,
				view: ["showTitle", "showDescription", "showDate"],
			},
			childs: [],
		},
	},
	{
		group: "Content elements",
		name: ContentTypes.COMMENTS,
		title: "Comments",
		icon: <Icon.ChatRight size="64px" />,
	},
];
