import { languageCheck } from "./utils";
import MarkdownView from "react-showdown";

export const availableLangs = ["en", "pl"];
export const defaultLang = "en";
const texts = {};

export function create(msgId, messageData) {
	texts[msgId] = messageData;
}
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
	if (typeof lang === "undefined") lang = defaultLang;
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

export function getTextAsMarkdown(msgId, lang) {
	const text = getText(msgId, lang);
	if (text) return <MarkdownView markdown={text} />;
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
