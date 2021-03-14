import { ICON_SIZE } from "../general/SidebarMenu";
import * as Icon from "react-bootstrap-icons";

import TreeLayouts from "./TreeLayouts";
import TreeCards from "./TreeCards";
import TreeCalendars from "./TreeCalendars";
import TreeGalleries from "./TreeGalleries";

import * as Messages from "../../libs/Messages";

const msg_base = "manager.sidebar.menutree";

export const menu = [
	{
		id: "layouts",
		icon: <Icon.LayoutWtf size={ICON_SIZE} />,
		name: Messages.getText(`${msg_base}.layouts`),
		Component: TreeLayouts,
	},
	{
		id: "cards",
		icon: <Icon.Journals size={ICON_SIZE} />,
		name: Messages.getText(`${msg_base}.cards`),
		Component: TreeCards,
	},
	{
		id: "calendars",
		icon: <Icon.Calendar3 size={ICON_SIZE} />,
		name: Messages.getText(`${msg_base}.calendars`),
		Component: TreeCalendars,
	},
	{
		id: "gelleries",
		icon: <Icon.Images size={ICON_SIZE} />,
		name: Messages.getText(`${msg_base}.galleries`),
		Component: TreeGalleries,
	},
	{
		id: "comments",
		icon: <Icon.ChatRightText size={ICON_SIZE} />,
		name: Messages.getText(`${msg_base}.comments`),
		Component: null,
	},
	{
		id: "assets",
		icon: <Icon.Server size={ICON_SIZE} />,
		name: Messages.getText(`${msg_base}.assets`),
		Component: null,
	},
];
