import "../scss/add-element.scss";

import React, { Component, useState } from "react";
import * as Messages from "../../../libs/Messages.js";
import { ContentTypes } from "../../../store/layouts";

import { SelectList } from "../../general/Window";
import * as Icon from "react-bootstrap-icons";
import Drag from "../../general/Drag";
import MarkdownView from "react-showdown";
import CustomScrollbar from "../../layout/CustomScrollbar";

const msg_base = "window.newElement";

export default class AddElement extends Component {
	state = {
		choicedElement: "",
	};

	constructor(props) {
		super(props);
		// const attr = this.props.attr;
		// const nodeName = attr.contentType.toUpperCase();

		const { dialog } = props;

		dialog({
			className: " window-add-element max-height",
			size: "panel",
			sizeCycle: ["maximized", "panel"],
			title: Messages.getText(`${msg_base}.window.title`),
		});
	}

	onChoiceElement = (choicedElement) => {
		this.setState({ choicedElement });
	};

	render() {
		return (
			<React.Fragment>
				<MarkdownView
					className="info"
					markdown={Messages.getText(`${msg_base}.info`)}
				/>
				<div style={{ flexGrow: "2", minHeight: "200px" }}>
					<CustomScrollbar>
						<ElementsList
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
					{/*
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
					*/}
				</fieldset>
			</React.Fragment>
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

const msg_block = Messages.getText(`${msg_base}.groupsNames.block`);
const msg_content = Messages.getText(`${msg_base}.groupsNames.content`);

const blockElements = [
	{
		group: msg_block,
		name: ContentTypes.HEADER,
		title: "Header",
		icon: <Icon.Window size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
		name: ContentTypes.MENUROUTER,
		title: "Menu router",
		icon: <Icon.MenuApp size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
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
		group: msg_block,
		name: ContentTypes.ROW,
		title: "Row",
		icon: <Icon.DistributeVertical size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
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
		group: msg_content,
		name: ContentTypes.MENULINK,
		title: "Menu item",
		icon: <Icon.Link size="64px" />,
		defaultNew: {
			id: "",
			title: {},
		},
	},
	{
		group: msg_content,
		name: ContentTypes.LANGSELECTOR,
		title: "Menu Language selector",
		icon: <Icon.List size="64px" />,
	},
	{
		group: msg_content,
		name: ContentTypes.CARD,
		title: "Card",
		icon: <Icon.JournalRichtext size="64px" />,
		defaultNew: {
			name: "",
			options: ["noLangWarnings", "useMarkdown"],
			childs: [],
		},
	},
	{
		group: msg_content,
		name: ContentTypes.GALERY,
		title: "Gallery",
		icon: <Icon.JournalAlbum size="64px" />,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_content,
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
		group: msg_content,
		name: ContentTypes.COMMENTS,
		title: "Comments",
		icon: <Icon.ChatRight size="64px" />,
	},
];
