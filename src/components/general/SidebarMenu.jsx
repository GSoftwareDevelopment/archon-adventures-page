import "../../scss/sidebar-menu.scss";
import "../../scss/sidebar-options-menu.scss";

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import WindowsStore from "../../store/windows";

import CustomScrollbar from "../layout/CustomScrollbar";
import { DialogManager, DialogSelector, ButtonsGroup } from "./Window";

//

export const ICON_SIZE = "1.5em";

//

class SidebarMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: this.props.active || null,
			options: [],
		};
		this.props.items.forEach((item) => {
			const id = item.id.toLowerCase();
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
				<div
					className={
						"sidebar-menu" + (this.props.isExpanded ? " isExpanded" : "")
					}
					style={this.props.style}
				>
					<CustomScrollbar>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								height: "100%",
							}}
						>
							{this.props.items.map((item, index) => {
								const id = item.id.toLowerCase();
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
												...item.style,
											}}
										>
											<button
												className="flat"
												onClick={() => {
													this.toggleNodeVisibility(id);
													if (item.onClick) item.onClick();
													if (item.redirectTo) {
														this.props.history.push(item.redirectTo);
													}
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
					<OptionsBar options={this.state.options} visible={true} />
					<DialogManager
						className="align-windows-column inner-windows"
						windowsStore={WindowsStore}
						group="sidebar"
					/>
					<DialogSelector
						windows={WindowsStore.windows.filter((wnd) => wnd.group === null)}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(observer(SidebarMenu));

const OptionsBar = ({ options, visible }) => {
	if (options?.length)
		return (
			<ButtonsGroup
				className={"sidebar-options-menu" + (visible ? " isExpanded" : "")}
				onlyIcons={false}
				buttons={options}
			/>
		);
	else return null;
};
