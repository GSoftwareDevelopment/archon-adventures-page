// Messages and content for CMS

import { create } from "../Messages";
// import Tip from "../../components/general/Tip";

const base = "props.layout";
create(`${base}.window.title`, { en: `Property of Layout` });

create(`${base}.name`, { en: `Name:` });
create(`${base}.name.tip`, { en: `Unique name for layout` });

create(`${base}.button.setAsDefault`, { en: "Set as default Layout" });
create(`${base}.button.setAsDefault.tip`, { en: "Set as default Layout" });

//

create(`${base}.languageList.title`, { en: `Languages:` });

create(`${base}.languageList.button.add`, { en: `` });
create(`${base}.languageList.button.add.tip`, { en: `Add language` });

create(`${base}.languageList.button.delete`, { en: `` });
create(`${base}.languageList.button.delete.tip`, { en: `Delete language` });

create(`${base}.languageList.button.setAsDefault`, { en: `` });
create(`${base}.languageList.button.setAsDefault.tip`, {
	en: `Set as default language`,
});

//

create(`${base}.languageList.newEntry.field.symbol`, { en: `` });
create(`${base}.languageList.newEntry.field.symbol.tip`, {
	en: `Language symbol. Use ISO 3166-1 alpha-2 for correct flag display.`,
});

create(`${base}.languageList.newEntry.field.country`, { en: `` });
create(`${base}.languageList.newEntry.field.country.tip`, {
	en: `Country full name`,
});

create(`${base}.languageList.newEntry.button.accept`, { en: `` });
create(`${base}.languageList.newEntry.button.accept.tip`, {
	en: `Accept`,
});

create(`${base}.languageList.newEntry.button.cancel`, { en: `` });
create(`${base}.languageList.newEntry.button.cancel.tip`, {
	en: `Cancel`,
});
