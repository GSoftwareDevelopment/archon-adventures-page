import { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { status } from "../../store/layouts";

import { EmojiFrown } from "react-bootstrap-icons";
import { parseElements } from "../page-elements/parse";

class PageLayout extends Component {
	async componentDidMount() {
		await LayoutsStore.fetchGetLayout({ current: true });
	}

	render() {
		switch (LayoutsStore.getStatus()) {
			case status.DONE:
				const rootElements = LayoutsStore.getSchema();
				return <div id="layout">{parseElements("Root", rootElements)}</div>;
			case status.INIT:
			case status.PENDING:
				return <div className="content-loader">Loading...</div>;
			default:
				return (
					<div className="content-loader">
						<EmojiFrown size="64px" />
						<p>Layout error</p>
					</div>
				);
		}
	}
}

export default observer(PageLayout);
