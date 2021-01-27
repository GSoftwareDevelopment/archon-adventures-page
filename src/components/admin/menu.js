import * as Icon from "react-bootstrap-icons";

import TreeLayouts from "./TreeLayouts";
import TreeCards from "./TreeCards";
import TreeCalendars from "./TreeCalendars";
import TreeGalleries from "./TreeGalleries";

const ICON_SIZE = 20;
export const SIZE_PROP = ICON_SIZE + "px";

export const MenuRoot = [
	{
		icon: <Icon.LayoutWtf size={SIZE_PROP} />,
		name: "Layouts",
		Component: TreeLayouts,
	},
	{
		icon: <Icon.Journals size={SIZE_PROP} />,
		name: "Cards",
		Component: TreeCards,
	},
	{
		icon: <Icon.Calendar3 size={SIZE_PROP} />,
		name: "Calendars",
		Component: TreeCalendars,
	},
	{
		icon: <Icon.Images size={SIZE_PROP} />,
		name: "Galleries",
		Component: TreeGalleries,
	},
	{
		icon: <Icon.ChatRightText size={SIZE_PROP} />,
		name: "Comments",
		Component: null,
	},
];
