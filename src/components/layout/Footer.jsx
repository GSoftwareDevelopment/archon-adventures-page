import React, { Component } from "react";

import logoAOL from "../../assets/AOL Logo.gif";

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
					<div>
						<span>e-mail:</span>
						<a className="link small" href="mailto:p.banas.pl@gmail.com">
							Paweł Banaś
						</a>
					</div>
					<div>
						<span>GitHub:</span>
						<a
							className="link small"
							href="https://github.com/GSoftwareDevelopment/archon-adventures-page"
						>
							GSoftwareDevelopment
						</a>
					</div>
				</div>
			</div>
		);
	}
}
