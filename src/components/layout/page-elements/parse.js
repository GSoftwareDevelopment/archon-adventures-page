import * as BlockElement from "./block";
import * as ContentElement from "./content";
import layoutsStore from "../../../store/layouts";
import { observer } from "mobx-react";

export const layoutElements = {
	header: (index, attr, elements) => (
		<BlockElement.Header key={index} attr={attr} elements={elements}>
			<ParseElements name="header" node={elements} />
		</BlockElement.Header>
	),

	"router-content": (index, attr, elements) => (
		<BlockElement.RouterContent key={index} attr={attr} elements={elements}>
			<ParseElements name="router-content" node={elements} />
		</BlockElement.RouterContent>
	),
	footer: (index, attr, elements) => (
		<BlockElement.Footer key={index} attr={attr} elements={elements}>
			<ParseElements name="footer" node={elements} />
		</BlockElement.Footer>
	),

	"menu-router": (index, attr, elements) => {
		if (!elements || typeof elements !== "object" || elements.length === 0)
			return null;

		return (
			<BlockElement.MenuRouter key={index} attr={attr} elements={elements}>
				<ParseElements name="router-menu" node={elements} />
			</BlockElement.MenuRouter>
		);
	},

	row: (index, attr, elements) => (
		<BlockElement.Row key={index} attr={attr} elements={elements}>
			<ParseElements name="row" node={elements} />
		</BlockElement.Row>
	),
	column: (index, attr, elements) => (
		<BlockElement.Column key={index} attr={attr} elements={elements}>
			<ParseElements name="column" node={elements} />
		</BlockElement.Column>
	),

	// menu context

	"menu-link": (index, attr) => (
		<ContentElement.MenuLink key={index} attr={attr} />
	),
	"lang-selector": (index, attr) => (
		<ContentElement.LangSelector key={index} attr={attr} />
	),

	// page context

	card: (index, attr) => {
		return (
			<ContentElement.Card
				key={index}
				name={attr.name}
				attr={attr}
				lang={layoutsStore.currentLang}
			/>
		);
	},

	calendar: (index, attr) => (
		<ContentElement.Calendar key={index + attr.path} attr={attr} />
	),

	galery: (index, attr) => null,
	comments: (index, attr) => null,
};

let currentLevel = -1;

const ParseElements = ({ name, node }) => {
	if (!node || node.length === 0) {
		console.log(`No child in node '${name}'`);
		return null;
	}

	currentLevel++;

	const childrenResult = node.map((_childId, index) => {
		const childId = _childId.toString();
		const element = layoutsStore.getElementById(childId);
		if (!element) {
			console.error(`Element #%s not exist.`, childId);
			// debugger;
			return null;
		}
		// if (element?._new) debugger;

		const { contentType, childs, ...attr } = element;
		if (layoutElements[contentType]) {
			attr._parentContentType = name;
			return layoutElements[contentType](childId, attr, childs, currentLevel);
		} else {
			console.log(`content type '${contentType} element not recognized.`);
			return null;
		}
	});

	currentLevel--;

	return childrenResult;
};

export default observer(ParseElements);
