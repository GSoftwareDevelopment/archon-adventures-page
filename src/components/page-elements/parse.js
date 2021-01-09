import "./scss/row.scss";

import * as BlockElement from "./block";
import * as ContentElement from "./content";

const layoutElements = {
	header: (index, attr, elements) => (
		<BlockElement.Header key={index} attr={attr} elements={elements}>
			{parseElements("header", elements)}
		</BlockElement.Header>
	),

	"router-content": (index, attr, elements) => (
		<BlockElement.RouterContent key={index} attr={attr} elements={elements}>
			{parseElements("router-content", elements)}
		</BlockElement.RouterContent>
	),
	footer: (index, attr, elements) => (
		<BlockElement.Footer key={index} attr={attr} elements={elements}>
			{parseElements("footer", elements)}
		</BlockElement.Footer>
	),

	"menu-router": (index, attr, elements) => {
		if (!elements || typeof elements !== "object" || elements.length === 0)
			return null;

		return (
			<BlockElement.MenuRouter key={index} attr={attr} elements={elements}>
				{parseElements("router-menu", elements)}
			</BlockElement.MenuRouter>
		);
	},

	row: (index, attr, elements) => (
		<div key={"content-row-" + index} className="content-row">
			{parseElements("row", elements)}
		</div>
	),

	// menu context

	"menu-link": (index, attr) => (
		<ContentElement.MenuLink key={index} attr={attr} />
	),
	"lang-selector": (index, attr) => (
		<ContentElement.LangSelector key={index} attr={attr} />
	),

	// page context

	card: (index, attr) => (
		<ContentElement.Card key={index} name={attr.name} attr={attr} />
	),

	calendar: (index, attr) => (
		<ContentElement.Calendar key={index} attr={attr} />
	),

	galery: (index, attr) => null,
	comments: (index, attr) => null,
};

let currentLevel = -1;

export function parseElements(parent, childs) {
	if (!childs || childs.length === 0) {
		console.log(`No child in node '${parent}'`);
		return null;
	}

	currentLevel++;
	console.groupCollapsed(`${currentLevel} > Node element: ${parent}`);

	const childrens = childs.map((element, index) => {
		const { contentType, elements, ...attr } = element;
		if (layoutElements[contentType]) {
			attr._parentContentType = parent;
			return layoutElements[contentType](
				`${contentType}.${index}`,
				attr,
				elements,
				currentLevel
			);
		} else {
			console.log(`content type '${contentType} element not recognized.`);
			return null;
		}
	});

	console.groupEnd();
	currentLevel--;

	return childrens;
}

export default layoutElements;
