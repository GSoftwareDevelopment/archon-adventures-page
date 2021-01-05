import React, { Component } from "react";
import { observer } from "mobx-react";
import * as Messages from "../layout/Messages";

import Card from "./Card";

class Footer extends Component {
	parseElement(element, index) {
		const { type, ...params } = element;

		if (this.currentLevel > 3) {
			Messages.toConsole("debug.footer.render.levelDepthExceeded");
			return null;
		}

		switch (type) {
			case "row":
				const rowElements = params.elements;
				this.currentLevel++;
				return (
					<div key={"footer-row-" + index} className="footer-row">
						{rowElements.map((element, index) => {
							return this.parseElement(element, index);
						})}
					</div>
				);

			case "card":
				return (
					<Card key={"footer-card-" + index} name={params.name} lang="en" />
				);

			default:
				Messages.toConsole("debug.footer.render.badElementType", index);
				return null;
		}
	}

	render() {
		// if (LayoutsStore.getStatus() !== status.DONE) return null;
		// const footerElements = LayoutsStore.getSchemeElements("footer");

		const footerElements = this.props.elements;
		this.currentLevel = 0;
		return (
			<footer>
				{footerElements.map((element, index) => {
					return this.parseElement(element, index);
				})}
			</footer>
		);
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
