import React, { Component } from "react";

import PropagateLoader from "react-spinners/PropagateLoader";

export default class ContentLoader extends Component {
	render() {
		if (this.props.busy)
			return (
				<div className="content-loader">
					<PropagateLoader
						css={{ backgroundColor: "#555" }}
						size="24px"
						color={"#36D7B7"}
						loading={this.props.busy}
					/>
				</div>
			);
		else return this.props.children;
	}
}
