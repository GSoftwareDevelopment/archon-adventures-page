// Messages and content for CMS

import { getText, create } from "../Messages";
import Tip from "../../components/general/Tip";

const base = "props.menuLink";
create(`${base}.window.title`, { en: `Property of Menu link` });

create(`${base}.destRoute.tip`, {
	en: `
Enter the path to the route. You may use the identifiers used in the 'content-route' elements by prefixing them with a '#' (hash).
You can use the Drag & Drop method by moving the route destination from the 'Layouts' directory.
`,
});

create(`${base}.destRoute`, {
	en: (
		<span>
			Destination route:
			<Tip title={getText(`${base}.destRoute.tip`)} />
		</span>
	),
});

//

create(`${base}.linkTitle`, { en: `Link title` });
