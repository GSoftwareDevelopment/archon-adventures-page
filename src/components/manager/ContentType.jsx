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
		title: ({ exact, path }) => (exact ? "=" : "") + path,
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
