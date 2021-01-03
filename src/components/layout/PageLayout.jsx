import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";
import Header from "../page-elements/Header";
import RouterContent from "../page-elements/RouterContent";
import Footer from "../page-elements/Footer";

class PageLayout extends Component {
	state = {
		routes: [],
	};

	render() {
		const schema = LayoutsStore.getSchema();
		return schema.map((part, index) => {
			switch (part.contentType) {
				case "header":
					return <Header key={index} elements={part.elements} />;
				case "router-content":
					return (
						<RouterContent
							key={part.name}
							path={part.path}
							exact={part.exact}
							elements={part.elements}
						/>
					);
				case "content":
					return null;
				// return <ContentPage key={index} elements={this.state.routes} />;
				case "footer":
					return <Footer key={index} elements={part.elements} />;
				default:
					console.log("Schema part is not recognized :/");
					return null;
			}
		});
	}
}

export default observer(PageLayout);
