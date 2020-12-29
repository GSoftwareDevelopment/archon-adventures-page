import React, { Component } from "react";

import logo6502 from "../../assets/6502.gif";
import logoAOL from "../../assets/AOL Logo.gif";

export default class Footer extends Component {
	render() {
		return (
			<div id="footer">
				<span className="icon">
					<h4>Powered by:</h4>
					<a
						className="link"
						href="http://mads.atari8.info/"
						rel="noreferrer"
						target="_blank"
					>
						MAD Pascal
					</a>
				</span>
				<span className="icon">
					<img src={logo6502} alt="6502 inside" width="80px" height="80px" />
				</span>
				<span className="icon left-space">
					<h4>Official patron of project is</h4>
					<a
						className="link"
						href="https://atarionline.pl"
						rel="noreferrer"
						target="_blank"
					>
						<img src={logoAOL} alt="AOL Logo" width="211px" height="64px" />
					</a>
				</span>
				<span className="icon left-space">
					<h4>Contact:</h4>
					<a className="link" href="mailto:archon.adventures@a-bolt.pl">
						archon.adventures@a-bolt.pl
					</a>
				</span>
			</div>
		);
	}
}
