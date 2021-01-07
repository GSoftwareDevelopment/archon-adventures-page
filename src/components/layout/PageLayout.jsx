import { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "../layout/Login";
import { parseElements } from "../page-elements/parse";

class PageLayout extends Component {
	render() {
		const rootElements = LayoutsStore.getSchema();
		return (
			<Router>
				<Route key="authorize" exact path="/auth" component={Login} />
				{parseElements("Root", rootElements)}
			</Router>
		);
	}
}

export default observer(PageLayout);
