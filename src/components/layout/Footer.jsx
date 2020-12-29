import React, { Component } from "react";

import logoAOL from "../../assets/AOL Logo.gif";
import * as Icon from "react-bootstrap-icons";

export default class Footer extends Component {
	render() {
		return (
			<div id="footer">
				{/*
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
				*/}
				<div className="footer-column">
					<h4>Official patron of project is</h4>
					<a
						className="link"
						href="https://atarionline.pl"
						rel="noreferrer"
						target="_blank"
					>
						<img src={logoAOL} alt="AOL Logo" width="211px" height="64px" />
					</a>
				</div>
				<div className="footer-column left-align">
					<h4>Contact:</h4>
					<a className="link small" href="mailto:p.banas.pl@gmail.com">
						<div>
							<Icon.At size="24px" style={{ marginRight: "10px" }} />
							p.banas.pl@gmail.com
						</div>
					</a>
					<a
						className="link small"
						href="https://github.com/GSoftwareDevelopment/archon-adventures-page"
					>
						<div>
							<Icon.Github size="24px" style={{ marginRight: "10px" }} />
							GSoftwareDevelopment
						</div>
					</a>
				</div>
			</div>
		);
	}
}
