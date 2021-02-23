// Messages and content for CMS

import { create } from "../Messages";

const base = "window.newElement";

create(`${base}.info`, {
	en: `
Select an item from the list below that you want to add and

drag it to the desired place in the Layouts list (in Sidebar), or...
`,
});

create(`${base}.window.title`, { en: "Add new element" });

create(`${base}.groupsNames.block`, { en: "Block elements" });
create(`${base}.groupsNames.content`, { en: "Content elements" });
