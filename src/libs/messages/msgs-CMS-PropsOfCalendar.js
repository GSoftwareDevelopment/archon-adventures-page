// Messages and content for CMS

import { getText, create } from "../Messages";
import Tip from "../../components/general/Tip";

// General FileSystem delete confirmation
create("props.calendar.window.title", { en: `Property of Calendar` });
create("props.calendar.sourcePath.tip", {
	en: `
Enter the path to the Calendar that will be displayed.
You can also drag a folder from the "Calendars" directory`,
});
create("props.calendar.attributes.pagination.tip", {
	en: `This option enables pagination of the list of Calendar items`,
});
create("props.calendar.attributes.limit.tip", {
	en: `
Limits the number of calendar items displayed.
With the "Use pagination" option enabled,
the limit value will be the maximum number of
elements per page.

If set to 0 (zero) it means no limit`,
});
create("props.calendar.sourcePath", {
	en: (
		<span>
			Calendar data source path:
			<Tip title={getText("props.calendar.sourcePath.tip")} />
		</span>
	),
});
create("props.calendar.attributes", { en: "Attributes:" });
create("props.calendar.attributes.showDate", { en: "Show date" });
create("props.calendar.attributes.showTitle", { en: "Show title" });
create("props.calendar.attributes.showDescription", { en: "Show description" });
create("props.calendar.attributes.pagination", {
	en: (
		<span>
			Use pagination
			<Tip title={getText("props.calendar.attributes.pagination.tip")} />
		</span>
	),
});
create("props.calendar.attributes.limit", {
	en: (
		<span>
			Limit number of entries:
			<Tip title={getText("props.calendar.attributes.limit.tip")} />
		</span>
	),
});
