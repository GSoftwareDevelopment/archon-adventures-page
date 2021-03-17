// Messages and content for CMS

import { getText, create } from "../Messages";
import Tip from "../../components/general/Tip";

const base = "props.calendar";

create(`${base}.window.title`, { en: `Property of Calendar` });

create(`${base}.sourcePath.tip`, {
	en: `
Enter the path to the Calendar that will be displayed.
You can also drag a folder from the **Calendars** directory`,
});
create(`${base}.sourcePath.field`, { en: "Calendar data source path" });
create(`${base}.sourcePath`, {
	en: (
		<span>
			{getText(`${base}.sourcePath.field`)}
			<Tip
				title={getText(`${base}.sourcePath.field`)}
				content={getText(`${base}.sourcePath.tip`)}
			/>
		</span>
	),
});

create(`${base}.activeEntry.tip`, {
	en: `
Allows you to turn an entry into a link to the card specified in the calendar entry.

If this option is activated, the redirect route can be specified in the **Redirect to route** field.
`,
});
create(`${base}.activeEntry.field`, { en: `Active entry` });
create(`${base}.activeEntry`, {
	en: (
		<span>
			{getText(`${base}.activeEntry.field`)}
			<Tip
				title={getText(`${base}.activeEntry.field`)}
				content={getText(`${base}.activeEntry.tip`)}
			/>
		</span>
	),
});

create(`${base}.redirectTo.tip`, {
	en: `
Route redirection when an entry is selected from the calendar list.

If you do not specify a rerouting route, it will be determined by the current route endpoint.
`,
});
create(`${base}.redirectTo.field`, { en: "Redirect to route" });
create(`${base}.redirectTo`, {
	en: (
		<span>
			{getText(`${base}.redirectTo.field`)}
			<Tip
				title={getText(`${base}.redirectTo.field`)}
				content={getText(`${base}.redirectTo.tip`)}
			/>
		</span>
	),
});

create(`${base}.attributes.pagination.tip`, {
	en: `This option enables pagination of the list of Calendar items`,
});
create(`${base}.attributes.limit.tip`, {
	en: `
Limits the number of calendar items displayed.

With the **Use pagination** option enabled, the limit value will be the maximum number of
elements per page.

If set to 0 (zero) it means no limit`,
});

create(`${base}.attributes.visibleContent`, { en: `Visible content:` });
create(`${base}.attributes.visibleContent.showDate`, { en: `Show date` });
create(`${base}.attributes.visibleContent.showTitle`, { en: `Show title` });
create(`${base}.attributes.visibleContent.showDescription`, {
	en: `Show description`,
});
create(`${base}.attributes`, { en: `Attributes:` });

create(`${base}.attributes.pagination.field`, { en: "Use pagination" });
create(`${base}.attributes.pagination`, {
	en: (
		<span>
			{getText(`${base}.attributes.pagination.field`)}
			<Tip
				title="Use pagination"
				content={getText(`${base}.attributes.pagination.tip`)}
			/>
		</span>
	),
});
create(`${base}.attributes.limit.field`, { en: "Limit number of entries" });
create(`${base}.attributes.limit`, {
	en: (
		<span>
			{getText(`${base}.attributes.limit.field`)}
			<Tip
				title={getText(`${base}.attributes.limit.field`)}
				content={getText(`props.calendar.attributes.limit.tip`)}
			/>
		</span>
	),
});
