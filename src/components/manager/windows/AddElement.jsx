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
			sizeCycle: ["panel"],
			disableMinimize: true,
			disableMaximize: true,
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
								Icon: Icon.BoxArrowUp size="1.5em" />,
								tip: "Add item before node",
							},
							{
								Icon: Icon.BoxArrowDown size="1.5em" />,
								tip: "Add item after node",
							},
							{
								Icon: Icon.BoxArrowInDown size="1.5em" />,
								tip: "Insert item inside node as first",
							},
							{
								Icon: Icon.BoxArrowInUp size="1.5em" />,
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

	const handleRenderItem = ({ group, name, Icon, title, defaultNew }, attr) => {
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
					<Icon size="64px" />
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
		Icon: Icon.Window,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
		name: ContentTypes.FOOTER,
		title: "Footer",
		Icon: Icon.WindowDock,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
		name: ContentTypes.MENUROUTER,
		title: "Menu router",
		Icon: Icon.MenuApp,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
		name: ContentTypes.ROUTERCONTENT,
		title: "Route content",
		Icon: Icon.Geo,
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
		Icon: Icon.DistributeVertical,
		defaultNew: {
			childs: [],
		},
	},
	{
		group: msg_block,
		name: ContentTypes.COLUMN,
		title: "Column",
		Icon: Icon.DistributeHorizontal,
		defaultNew: {
			childs: [],
		},
	},
];

const contentElements = [
	{
		group: msg_content,
		name: ContentTypes.MENULINK,
		title: "Menu link",
		Icon: Icon.Link,
		defaultNew: {
			id: "",
			title: {},
		},
	},
	{
		group: msg_content,
		name: ContentTypes.LANGSELECTOR,
		title: "Menu Language selector",
		Icon: Icon.List,
	},
	{
		group: msg_content,
		name: ContentTypes.CARD,
		title: "Card",
		Icon: Icon.JournalRichtext,
		defaultNew: {
			name: "",
			options: ["noLangWarnings", "useMarkdown"],
		},
	},
	{
		group: msg_content,
		name: ContentTypes.GALERY,
		title: "Gallery",
		Icon: Icon.JournalAlbum,
		defaultNew: {},
	},
	{
		group: msg_content,
		name: ContentTypes.CALENDAR,
		title: "Calendar (Blog)",
		Icon: Icon.Calendar3,
		defaultNew: {
			path: "",
			options: {
				pagination: false,
				limit: 0,
				view: ["showTitle", "showDescription", "showDate"],
			},
		},
	},
	{
		group: msg_content,
		name: ContentTypes.COMMENTS,
		title: "Comments",
		Icon: Icon.ChatRight,
	},
];
