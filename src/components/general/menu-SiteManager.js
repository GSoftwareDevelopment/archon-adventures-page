import { SIZE_PROP } from "../general/menu";
import * as Icon from "react-bootstrap-icons";

import TreeLayouts from "../manager/TreeLayouts";
import TreeCards from "../manager/TreeCards";
import TreeCalendars from "../manager/TreeCalendars";
import TreeGalleries from "../manager/TreeGalleries";

export const menuSiteManager = [
	{
		id: "layouts",
		icon: <Icon.LayoutWtf size={SIZE_PROP} />,
		name: "Layouts",
		Component: TreeLayouts,
	},
	{
		id: "cards",
		icon: <Icon.Journals size={SIZE_PROP} />,
		name: "Cards",
		Component: TreeCards,
	},
	{
		id: "calendars",
		icon: <Icon.Calendar3 size={SIZE_PROP} />,
		name: "Calendars",
		Component: TreeCalendars,
	},
	{
		id: "gelleries",
		icon: <Icon.Images size={SIZE_PROP} />,
		name: "Galleries",
		Component: TreeGalleries,
	},
	{
		id: "comments",
		icon: <Icon.ChatRightText size={SIZE_PROP} />,
		name: "Comments",
		Component: null,
	},
];
