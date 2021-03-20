import { ContentTypes } from "../../store/layouts";

import { unifyPath } from "../../libs/utils";
import { Path } from "../../setup";

import {
	// item icons
	Diagram3 as IconLayout,
	Geo as IconRouterContent,
	Link as IconMenuLink,
	List as IconLangSelector,
	JournalRichtext as IconCard,
	Calendar3 as IconCalendar,
	JournalAlbum as IconGallery,
	ChatRight as IconComment,
} from "react-bootstrap-icons";

import PropsOfLayout from "./windows/PropsOfLayout";
import PropsOfCalendar from "./windows/PropsOfCalendar";
import PropsOfMenuLink from "./windows/PropsOfMenuLink";
import PropsOfCard from "./windows/PropsOfCard";
import PropsOfRouterContent from "./windows/PropsOfRouterContent";

export const contentTypeItems = {};

function addItem(contentType, params) {
	contentTypeItems[contentType] = params;
}

// Content types definition foritems in Sidebar Layouts section

addItem(ContentTypes.LAYOUT, {
	Icon: IconLayout,
	title: ({ name, ...attr }) => name + (attr.default ? " (default)" : ""),
	elementProps: PropsOfLayout,
});
addItem(ContentTypes.MENULINK, {
	Icon: IconMenuLink,
	title: ({ destRoute, id }) => destRoute || id,
	elementProps: PropsOfMenuLink,
});
addItem(ContentTypes.LANGSELECTOR, {
	Icon: IconLangSelector,
});
addItem(ContentTypes.ROUTERCONTENT, {
	Icon: IconRouterContent,
	title: ({ exact, path }) => (exact ? "[exact] " : "") + path,
	elementProps: PropsOfRouterContent,
});
addItem(ContentTypes.CARD, {
	Icon: IconCard,
	title: ({ name }) => Path.DELIMITER + unifyPath(name),
	elementProps: PropsOfCard,
});
addItem(ContentTypes.CALENDAR, {
	Icon: IconCalendar,
	title: ({ path }) => (path ? Path.DELIMITER + unifyPath(path) : "Calendar"),
	elementProps: PropsOfCalendar,
});
addItem(ContentTypes.GALERY, {
	Icon: IconGallery,
});
addItem(ContentTypes.COMMENTS, {
	Icon: IconComment,
});

/*
	layout: {
		Icon: IconLayout,
		title: ({ name, ...attr }) => name + (attr.default ? " (default)" : ""),
		elementProps: PropsOfLayout,
	},
	"menu-link": {
		Icon: IconMenuLink,
		title: ({ destRoute, id }) => destRoute || id,
		elementProps: PropsOfMenuLink,
	},
	"lang-selector": {
		Icon: IconLangSelector,
	},
	"router-content": {
		Icon: IconRouterContent,
		title: ({ exact, path }) => (exact ? "[exact] " : "") + path,
		elementProps: PropsOfRouterContent,
	},
	card: {
		Icon: IconCard,
		title: ({ name }) => Path.DELIMITER + unifyPath(name),
		elementProps: PropsOfCard,
	},
	calendar: {
		Icon: IconCalendar,
		title: ({ path }) => (path ? Path.DELIMITER + unifyPath(path) : "Calendar"),
		elementProps: PropsOfCalendar,
	},
	galery: {
		Icon: IconGallery,
	},
	comments: {
		Icon: IconComment,
	},
};
*/
