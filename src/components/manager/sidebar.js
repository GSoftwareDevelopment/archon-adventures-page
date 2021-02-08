import { ICON_SIZE } from "../general/SidebarMenu";
import * as Icon from "react-bootstrap-icons";

import TreeLayouts from "./TreeLayouts";
import TreeCards from "./TreeCards";
import TreeCalendars from "./TreeCalendars";
import TreeGalleries from "./TreeGalleries";

export const menu = [
	{
		id: "layouts",
		icon: <Icon.LayoutWtf size={ICON_SIZE} />,
		name: "Layouts",
		Component: TreeLayouts,
	},
	{
		id: "cards",
		icon: <Icon.Journals size={ICON_SIZE} />,
		name: "Cards",
		Component: TreeCards,
	},
	{
		id: "calendars",
		icon: <Icon.Calendar3 size={ICON_SIZE} />,
		name: "Calendars",
		Component: TreeCalendars,
	},
	{
		id: "gelleries",
		icon: <Icon.Images size={ICON_SIZE} />,
		name: "Galleries",
		Component: TreeGalleries,
	},
	{
		id: "comments",
		icon: <Icon.ChatRightText size={ICON_SIZE} />,
		name: "Comments",
		Component: null,
	},
];
