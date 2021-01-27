import React, { Component } from "react";

export default class SidebarMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.props.items.forEach((item) => {
			const id = item.name.toLowerCase();
			this.state[id] = false;
		});
	}

	toggleNodeVisibility(id) {
		const old = this.state[id];
		this.setState({ [id]: !old });
	}

	render() {
		return this.props.items.map((item, index) => {
			const id = item.name.toLowerCase();
			const MenuComponent = item.Component;
			return (
				<React.Fragment key={index}>
					<button
						className="flat"
						onClick={() => {
							this.toggleNodeVisibility(id);
							this.props.setOptions([]);
						}}
					>
						{item.icon}
						<span>{item.name}</span>
					</button>
					{item.Component && (
						<MenuComponent
							visible={this.state[id]}
							onOpenWindow={this.props.onOpenWindow}
							setOptions={this.props.setOptions}
						/>
					)}
				</React.Fragment>
			);
		});
	}
}
