// Messages displayed in site layout

import { create } from "./Messages";

create("contentDoesNotExist", {
	console: {
		type: "error",
		content: "Content does not exist",
	},
	en: `
# Content does not exist

---

There can be several reasons why this error will occur:

- error in the url
- the indicated content has been removed
- or the content has changed location
`,
});

create("fetchingError", {
	console: {
		type: "error",
		content: `Can't load content.\n%o`,
	},
	en: `
# Can't load content.

---

- Try to refresh the page,

- If that doesn't help, check your internet connection.

---
If the above steps did not work, contact the site administrator.
`,
});

create("langWarning", {
	console: {
		type: "log",
		content: `Changing prefered language to '%s', becouse '%s' is not available.`,
	},
	en: `
# Content language has been changed

This part of site is not available in a preferred language.

Available versions:
`,
	pl: `
Dla tej części strony preferowany język nie jest dostępny.
Język został zmieniony

Dostępne wersje językowe:
`,
});

create("noLangContent", {
	console: {
		type: "log",
		content: `! Card has't defined content for the available languages.`,
	},
	en: `There is no defined content for the available languages.`,
	pl: `Brak zdefiniowanej treści dla dostępnych języków.`,
});
