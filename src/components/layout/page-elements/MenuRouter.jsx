import "./scss/router-menu.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../../store/layouts";

class MenuRouter extends Component {
	constructor(props) {
		super(props);
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
		const currentLayout = LayoutsStore.current;
		this.routes = currentLayout.childs
			.map((id) => {
				return LayoutsStore.getElementById(id.toString());
			})
			.filter((element) => element.contentType === "router-content")
			.map((element) => ({
				id: element.id,
				path: element.path,
			}));

		const updateChildrenWithProps = React.Children.map(
			this.props.children,
			(child, i) => {
				if (child)
					return React.cloneElement(child, {
						//this properties are available as a props in child components
						routes: this.routes,
						onClick: this.collapse,
					});
				else return null;
			}
		);

		return (
			<nav id="router-menu" className={this.state.collapsed ? "collapsed" : ""}>
				<ul>
					<MenuToggler key="menu-toggler" onClick={this.toggleCollapse} />
					{updateChildrenWithProps}
				</ul>
			</nav>
		);
	}
}

// Menu components

function MenuToggler(props) {
	return (
		<li
			className="toggler link"
			onClick={() => {
				props.onClick();
			}}
		>
			<img src="/imgs/AtariLogo.png" alt="Menu" style={{ maxHeight: "32px" }} />
		</li>
	);
}

export default observer(MenuRouter);
