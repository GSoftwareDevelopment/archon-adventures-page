import { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../store/layouts";

import { EmojiFrown } from "react-bootstrap-icons";
import { parseElements } from "../page-elements/parse";

class PageLayout extends Component {
	async componentDidMount() {
		await LayoutsStore.fetchList();
	}

	render() {
		switch (LayoutsStore.currentStatus) {
			case Status.DONE:
				const rootElements = LayoutsStore.default.childs;
				return <div id="layout">{parseElements("Root", rootElements)}</div>;
			case Status.INIT:
			case Status.PENDING:
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
