import "./scss/footer.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

class Footer extends Component {
	render() {
		return <footer>{this.props.children}</footer>;
	}
}

export default observer(Footer);
