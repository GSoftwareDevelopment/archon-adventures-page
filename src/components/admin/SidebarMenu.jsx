import React, { Component } from "react";

import CustomScrollbar from "../layout/CustomScrollbar";
import { ButtonsGroup } from "./windows/Window";

export default class SidebarMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: null,
			options: [],
		};
		this.props.items.forEach((item) => {
			const id = item.name.toLowerCase();
			this.state[id] = false;
		});
	}

	toggleNodeVisibility(id) {
		this.setState({ active: id });
		if (this.state.active === id) {
			this.setState({ options: [] });
		}
		const old = this.state[id];
		this.setState({ [id]: !old });
	}

	setOptions = (opt) => {
		this.setState({ options: opt });
	};

	render() {
		const currentActive = this.state.active;
		return (
			<React.Fragment>
				<div className="sidebar-menu">
					<CustomScrollbar>
						<div style={{ display: "flex", flexDirection: "column" }}>
							{this.props.items.map((item, index) => {
								const id = item.name.toLowerCase();
								const MenuComponent = item.Component;
								return (
									<React.Fragment key={index}>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												borderLeft:
													currentActive === id
														? "#fff8 2px solid"
														: "#fff0 2px solid",
											}}
										>
											<button
												className="flat"
												onClick={() => {
													this.toggleNodeVisibility(id);
												}}
											>
												{item.icon}
												<span>{item.name}</span>
											</button>
											{item.Component && (
												<MenuComponent
													visible={this.state[id]}
													onOpenWindow={this.props.onOpenWindow}
													setOptions={this.setOptions}
													setActive={() => {
														if (this.state.active !== id)
															this.setState({ active: id });
													}}
												/>
											)}
										</div>
									</React.Fragment>
								);
							})}
						</div>
					</CustomScrollbar>
				</div>
				{Boolean(this.state.options?.length) && (
					<ButtonsGroup
						className={
							"options-group-button" + (this.props.visible ? " isExpanded" : "")
						}
						onlyIcons={false}
						buttons={this.state.options}
					/>
				)}
			</React.Fragment>
		);
	}
}
