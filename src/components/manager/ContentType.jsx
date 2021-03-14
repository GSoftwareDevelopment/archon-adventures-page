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

export const treeItems = {
	layout: {
		icon: IconLayout,
		title: ({ name, ...attr }) => name + (attr.default ? " (default)" : ""),
		elementProps: PropsOfLayout,
	},
	"menu-link": {
		icon: IconMenuLink,
		title: ({ destRoute, id }) => destRoute || id,
		elementProps: PropsOfMenuLink,
	},
	"lang-selector": {
		icon: IconLangSelector,
	},
	"router-content": {
		icon: IconRouterContent,
		title: ({ path }) => path,
		elementProps: PropsOfRouterContent,
	},
	card: {
		icon: IconCard,
		title: ({ name }) => Path.DELIMITER + unifyPath(name),
		elementProps: PropsOfCard,
	},
	calendar: {
		icon: IconCalendar,
		title: ({ path }) => (path ? Path.DELIMITER + unifyPath(path) : "Calendar"),
		elementProps: PropsOfCalendar,
	},
	galery: {
		icon: IconGallery,
	},
	comments: {
		icon: IconComment,
	},
};
