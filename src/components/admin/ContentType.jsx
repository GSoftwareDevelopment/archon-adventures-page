import { unifyPath } from "../../libs/utils";
import { Path } from "../../setup";

import {
	// item icons
	Link45deg as IconRouterContent,
	Link as IconMenuLink,
	List as IconLangSelector,
	JournalRichtext as IconCard,
	Calendar3 as IconCalendar,
	JournalAlbum as IconGallery,
	ChatRight as IconComment,
} from "react-bootstrap-icons";

import PropsOfLayout from "./windows/PropsOfLayout";
import PropsOfCalendar from "./windows/PropsOfCalendar";

const SIZE_PROP = "20px";
export const treeItems = {
	layout: {
		icon: null,
		title: ({ name }) => <div style={{ fontWeight: "bold" }}>{name}</div>,
		elementProps: PropsOfLayout,
	},
	"menu-link": {
		icon: <IconMenuLink size={SIZE_PROP} />,
		title: ({ id }) => <div style={{ fontStyle: "italic" }}>{id}</div>,
	},
	"lang-selector": {
		icon: <IconLangSelector size={SIZE_PROP} />,
	},
	"router-content": {
		icon: <IconRouterContent size={SIZE_PROP} />,
		title: ({ id }) => <span style={{ fontStyle: "italic" }}>{id}</span>,
	},
	card: {
		icon: <IconCard size={SIZE_PROP} />,
		title: ({ name }) => (
			<span style={{ fontStyle: "italic" }}>
				{Path.DELIMITER + unifyPath(name)}
			</span>
		),
	},
	calendar: {
		icon: <IconCalendar size={SIZE_PROP} />,
		title: ({ path }) => (
			<span style={{ fontStyle: "italic" }}>
				{Path.DELIMITER + unifyPath(path)}
			</span>
		),
		elementProps: PropsOfCalendar,
	},
	galery: {
		icon: <IconGallery size={SIZE_PROP} />,
	},
	comments: {
		icon: <IconComment size={SIZE_PROP} />,
	},
};
