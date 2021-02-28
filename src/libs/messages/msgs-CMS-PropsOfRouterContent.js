// Messages and content for CMS

import { getText, create } from "../Messages";
import Tip from "../../components/general/Tip";

const base = "props.routerContent";
create(`${base}.window.title`, { en: `Property of Router content` });

create(`${base}.routeID`, { en: `Route ID#` });
create(`${base}.path.tip`, {
	en: `Enter the URI address.`,
});

create(`${base}.path.field`, { en: "End point of route" });
create(`${base}.path`, {
	en: (
		<span>
			{getText(`${base}.path.field`)}
			<Tip
				title={getText(`${base}.path.field`)}
				content={getText(`${base}.path.tip`)}
			/>
		</span>
	),
});

//

create(`${base}.exact`, { en: `Exact match route path` });
create(`${base}.useLayout`, { en: `Switch to layout:` });
create(`${base}.useLayout.default`, { en: `(don't change layout)` });
create(`${base}.useLayout.available`, { en: `Available layouts:` });
