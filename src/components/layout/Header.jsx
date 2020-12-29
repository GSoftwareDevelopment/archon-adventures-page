import React, { Component } from "react";
import { Link } from "react-router-dom";

import menuItems from "./menuItems";

export default class Header extends Component {
	constructor() {
		super();

		this.state = {
			collapsed: true,
		};
	}

	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};

	collapse = () => {
		this.setState({ collapsed: true });
	};

	render() {
		return (
			<div id="header">
				<div id="main-menu" className={this.state.collapsed ? "collapsed" : ""}>
					<ul className="menu-pane">
						{menuItems.map((item, index) => (
							<li key={index}>
								{item.refTo ? (
									<Link
										className="link"
										to={item.refTo}
										onClick={this.collapse}
									>
										{item.title}
									</Link>
								) : (
									<div className="toggler" onClick={this.toggleCollapse}>
										{item.title}
									</div>
								)}
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	}
}
