import "./scss/column.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

class Column extends Component {
	render() {
		return <div className="content-column">{this.props.children}</div>;
	}
}

export default observer(Column);
