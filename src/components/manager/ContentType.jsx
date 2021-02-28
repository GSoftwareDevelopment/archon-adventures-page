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
import PropsOfMenuLink from "./windows/PropsOfMenuLink";
import PropsOfCard from "./windows/PropsOfCard";
import PropsOfRouterContent from "./windows/PropsOfRouterContent";

const SIZE_PROP = "1.5em";
export const treeItems = {
	layout: {
		icon: null,
		title: ({ name, ...attr }) => (
			<div style={{ fontWeight: "bold" }}>
				{name}
				{attr.default && <span> (default)</span>}
			</div>
		),
		elementProps: PropsOfLayout,
	},
	"menu-link": {
		icon: <IconMenuLink size={SIZE_PROP} />,
		title: ({ destRoute, id }) => (
			<div style={{ fontStyle: "italic" }}>{destRoute || id}</div>
		),
		elementProps: PropsOfMenuLink,
	},
	"lang-selector": {
		icon: <IconLangSelector size={SIZE_PROP} />,
	},
	"router-content": {
		icon: <IconRouterContent size={SIZE_PROP} />,
		title: ({ id }) => <span style={{ fontStyle: "italic" }}>{id}</span>,
		elementProps: PropsOfRouterContent,
	},
	card: {
		icon: <IconCard size={SIZE_PROP} />,
		title: ({ name }) => (
			<span style={{ fontStyle: "italic" }}>
				{Path.DELIMITER + unifyPath(name)}
			</span>
		),
		elementProps: PropsOfCard,
	},
	calendar: {
		icon: <IconCalendar size={SIZE_PROP} />,
		title: ({ path }) => {
			if (path)
				return (
					<span style={{ fontStyle: "italic" }}>
						{Path.DELIMITER + unifyPath(path)}
					</span>
				);
			else return "Calendar element";
		},
		elementProps: PropsOfCalendar,
	},
	galery: {
		icon: <IconGallery size={SIZE_PROP} />,
	},
	comments: {
		icon: <IconComment size={SIZE_PROP} />,
	},
};
