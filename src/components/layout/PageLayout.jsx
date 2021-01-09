import { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

// import { BrowserRouter as Router, Route } from "react-router-dom";
import { parseElements } from "../page-elements/parse";

class PageLayout extends Component {
	render() {
		const rootElements = LayoutsStore.getSchema();
		return parseElements("Root", rootElements);
	}
}

export default observer(PageLayout);
