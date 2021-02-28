import "./scss/row.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

class Row extends Component {
	render() {
		return <div className="content-row">{this.props.children}</div>;
	}
}

export default observer(Row);
