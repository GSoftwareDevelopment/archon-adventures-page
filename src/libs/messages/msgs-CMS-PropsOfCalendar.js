// Messages and content for CMS

import { getText, create } from "../Messages";
import Tip from "../../components/general/Tip";

const base = "props.calendar";
// General FileSystem delete confirmation
create(`${base}.window.title`, { en: `Property of Calendar` });
create(`${base}.sourcePath.tip`, {
	en: `
Enter the path to the Calendar that will be displayed.
You can also drag a folder from the "Calendars" directory`,
});
create(`${base}.attributes.pagination.tip`, {
	en: `This option enables pagination of the list of Calendar items`,
});
create(`${base}.attributes.limit.tip`, {
	en: `
Limits the number of calendar items displayed.
With the "Use pagination" option enabled,
the limit value will be the maximum number of
elements per page.

If set to 0 (zero) it means no limit`,
});
create(`${base}.sourcePath`, {
	en: (
		<span>
			Calendar data source path:
			<Tip title={getText(`${base}.sourcePath.tip`)} />
		</span>
	),
});
create(`${base}.attributes`, { en: `Attributes:` });
create(`${base}.attributes.showDate`, { en: `Show date` });
create(`${base}.attributes.showTitle`, { en: `Show title` });
create(`${base}.attributes.showDescription`, { en: `Show description` });
create(`${base}.attributes.pagination`, {
	en: (
		<span>
			Use pagination
			<Tip title={getText(`${base}.attributes.pagination.tip`)} />
		</span>
	),
});
create(`${base}.attributes.limit`, {
	en: (
		<span>
			Limit number of entries:
			<Tip title={getText(`props.calendar.attributes.limit.tip`)} />
		</span>
	),
});
