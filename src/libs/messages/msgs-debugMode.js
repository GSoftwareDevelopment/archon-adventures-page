// Console messages in debug mode

import { create } from "../Messages";

create("debug.card.userLangChoice", {
	console: {
		type: "log",
		content: "Language for card has been set to: %s",
	},
});

// MenuRouter render

create("debug.menuRouter.render.itemLangsNotDefined", {
	console: {
		type: "error",
		content: "! The menu item #%n does not have any languages defined",
	},
});

create("debug.menuRouter.render.badSymbol", {
	console: {
		type: "error",
		content: "! Name '%s' property of menu router item is not recognize.",
	},
});

create("debug.menuRouter.userAction.changeLangPreference", {
	console: {
		type: "log",
		content: "Change in language preference. Choice '%s' language",
	},
});

// Card render

create("debug.card.render.open", {
	console: {
		type: "groupCollapsed",
		content: "Card %s",
	},
});

create("debug.card.render.bodyLanguages", {
	console: {
		type: "log",
		content: "Defined body languages: %o",
	},
});

create("debug.card.render.optionsModified.open", {
	console: {
		type: "groupCollapsed",
		content: "This card modified default options:",
	},
});

create("debud.card.render.optionsModfied.flagSet", {
	console: {
		type: "log",
		content: "Flag %s is set",
	},
});

create("debug.card.render.optionsModified.badOption", {
	console: {
		type: "error",
		content: "! Option '%s' is not recognized.",
	},
});

create("debug.card.render.optionsModified.close", {
	console: {
		type: "groupEnd",
		content: "",
	},
});

create("debug.card.render.close", {
	console: {
		type: "groupEnd",
		content: "",
	},
});

// Footer

create("debug.footer.render.levelDepthExceeded", {
	console: {
		type: "error",
		content: "Component max depth level exceeded",
	},
});

create("debug.footer.render.badElementType", {
	console: {
		type: "error",
		content: "! Footer element #%n is not recognized",
	},
});
