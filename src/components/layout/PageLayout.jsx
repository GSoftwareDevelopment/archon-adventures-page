import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../store/layouts";

import { EmojiFrown } from "react-bootstrap-icons";
import ParseElements from "./page-elements/parse";

class PageLayout extends Component {
	async componentDidMount() {
		await LayoutsStore.fetchList();
	}

	render() {
		switch (LayoutsStore.currentStatus) {
			case Status.DONE:
			case Status.SILENT:
			case Status.WARN:
				const defaultLayout = LayoutsStore.default;
				return (
					<React.Fragment>
						{Boolean(defaultLayout) ? (
							<div id="layout">
								<ParseElements
									name="Root"
									node={defaultLayout.childs}
									lang={LayoutsStore.currentLang}
								/>
							</div>
						) : (
							<div className="content-loader">
								<EmojiFrown size="64px" />
								<p>Default Layout is not defiend!</p>
							</div>
						)}
						{this.props.children}
					</React.Fragment>
				);
			case Status.INIT:
			case Status.PENDING:
				return <div className="content-loader">Loading Layout...</div>;
			default:
				return (
					<div className="content-loader">
						<EmojiFrown size="64px" />
						<p>Layout error</p>
						<p>{LayoutsStore.getMessage}</p>
					</div>
				);
		}
	}
}

export default observer(PageLayout);
