import { languageCheck } from "../../libs/utils";

export const availableLangs = ["en", "pl"];
export const defaultLang = "en";
export const texts = {
	// console messages in debug mode

	"debug.card.fetchError.ContentNotFound": {
		console: {
			type: "error",
			content: "Content not found for search parameters: %o",
		},
	},
	"debug.card.userLangChoice": {
		console: {
			type: "log",
			content: "Language for card has been set to: %s",
		},
	},

	// MenuRouter render
	"debug.menuRouter.render.itemLangsNotDefined": {
		console: {
			type: "error",
			content: "! The menu item #%n does not have any languages defined",
		},
	},
	"debug.menuRouter.render.badSymbol": {
		console: {
			type: "error",
			content: "! Name '%s' property of menu router item is not recognize.",
		},
	},
	"debug.menuRouter.userAction.changeLangPreference": {
		console: {
			type: "log",
			content: "Change in language preference. Choice '%s' language",
		},
	},

	// Card render
	"debug.card.render.open": {
		console: {
			type: "groupCollapsed",
			content: "Card %s",
		},
	},
	"debug.card.render.bodyLanguages": {
		console: {
			type: "log",
			content: "Defined body languages: %o",
		},
	},
	"debug.card.render.optionsModified.open": {
		console: {
			type: "groupCollapsed",
			content: "This card modified default options:",
		},
	},
	"debud.card.render.optionsModfied.flagSet": {
		console: {
			type: "log",
			content: "Flag %s is set",
		},
	},
	"debug.card.render.optionsModified.badOption": {
		console: {
			type: "error",
			content: "! Option '%s' is not recognized.",
		},
	},
	"debug.card.render.optionsModified.close": {
		console: {
			type: "groupEnd",
			content: "",
		},
	},
	"debug.card.render.close": {
		console: {
			type: "groupEnd",
			content: "",
		},
	},

	// Footer
	"debug.footer.render.levelDepthExceeded": {
		console: {
			type: "error",
			content: "Component max depth level exceeded",
		},
	},
	"debug.footer.render.badElementType": {
		console: {
			type: "error",
			content: "! Footer element #%n is not recognized",
		},
	},
	// messages displayed in site layout

	langWarning: {
		console: {
			type: "log",
			content: `Changing prefered language to '%s', becouse '%s' is not available.`,
		},
		en: `
This part of site is not available in the language you preference.
Language has been changed.

Versions available:
`,
		pl: `
Dla tej części strony preferowany język nie jest dostępny.
Język został zmieniony

Dostępne wersje językowe:
`,
	},
	noLangContent: {
		console: {
			type: "log",
			content: `! Card has't defined content for the available languages.`,
		},
		en: `There is no defined content for the available languages.`,
		pl: `Brak zdefiniowanej treści dla dostępnych języków.`,
	},
};

/**
 * Multi-language text selector.
 * If the specified language `lang` is not found, the function automatically searches for a matching language by rules: 1. default language, 2. first available language.
 * @param {*} msgId - message key-id in `texts` object
 * @param {*} lang - symbol of language to get
 * @returns
 * return the symbol of the language found.
 * return `undefined` if there is no message-key in the` texts` table.
 * return 'null' in case of undefined language in the message-key of the `texts` table
 */
export function getText(msgId, lang) {
	let msg = texts[msgId];
	if (msg) {
		const usedLang = languageCheck(lang, defaultLang, availableLangs, (l) => {
			return msg[l];
		});
		if (usedLang) return msg[usedLang];
		else return null;
	} else {
		return undefined;
	}
}

/**
 * Genereal console logger
 * @param {string} msgId - message key-id in `texts` object
 * @param  {...any} params - additional parameters pulled in main message
 */
export function toConsole(msgId, ...params) {
	let msg = texts[msgId];
	if (msg) {
		if (msg.console) {
			console[msg.console.type](msg.console.content, ...params);
		}
	} else {
		console.error(`! Key ${msgId} not founnd`);
	}
}
