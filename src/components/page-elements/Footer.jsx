import "./scss/footer.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";

class Footer extends Component {
	render() {
		return <footer>{this.props.children}</footer>;
	}
}

export default observer(Footer);

/*
	<div className="footer-column">
			<div>
			<h4>Powered by:</h4>
			<a
				className="link"
				href="http://mads.atari8.info/"
				rel="noreferrer"
				target="_blank"
			>
				MAD Pascal
			</a>
		</div>
		<div>
		<img src={logo6502} alt="6502 inside" width="80px" height="80px" />
		</div>
		</div>


## Official patron of project is

[AtariOnLine.pl](https://atarionline.pl)

#### Contact:

- (icon:At) e-mail: p.banas.pl@gmail.com
- (icon:GitHub) GitHub: [GSoftwareDevelopment](https://github.com/GSoftwareDevelopment/archon-adventures-page)
*/
