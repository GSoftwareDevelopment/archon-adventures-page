import TreeLayouts from "./TreeLayouts";
import TreeCards from "./TreeCards";
import TreeCalendars from "./TreeCalendars";
import TreeGalleries from "./TreeGalleries";

export const MenuRoot = [
	{ icon: "LayoutWtf", name: "Layouts", Component: TreeLayouts },
	{ icon: "Journals", name: "Cards", Component: TreeCards },
	{ icon: "Calendar3", name: "Calendars", Component: TreeCalendars },
	{ icon: "Images", name: "Galleries", Component: TreeGalleries },
	{ icon: "ChatRightText", name: "Comments", Component: null },
];
