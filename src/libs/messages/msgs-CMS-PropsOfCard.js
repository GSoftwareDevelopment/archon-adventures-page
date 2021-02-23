// Messages and content for CMS

import { getText, create } from "../Messages";
import Tip from "../../components/general/Tip";

// General FileSystem delete confirmation

const base = "props.card";
create(`${base}.window.title`, { en: `Property of Card` });

create(`${base}.sourceFilePath.tip`, {
	en: `
Enter the full path and name to the Card that will be displayed.
You can also drag a file from the "Cards" directory`,
});

create(`${base}.sourceFilePath`, {
	en: (
		<span>
			Card file:
			<Tip title={getText(`${base}.sourceFilePath.tip`)} />
		</span>
	),
});

create(`${base}.attributes`, { en: `Attributes:` });
create(`${base}.attributes.noLangWarnings`, {
	en: `Prevent language warnings`,
});
create(`${base}.attributes.useMarkdown`, { en: `Use Markdown to format card` });
create(`${base}.attributes.allowUserComments`, {
	en: `Allow users to comment`,
});
create(`${base}.attributes.allowAnonimousComments`, {
	en: `Allow anonimous to comment`,
});
