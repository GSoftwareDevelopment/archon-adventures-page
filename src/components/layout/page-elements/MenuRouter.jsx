import "./scss/router-menu.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { ContentTypes } from "../../../store/layouts";

class MenuRouter extends Component {
	state = {
		collapsed: true,
	};

	routes;

	toggleCollapse = () => {
		this.setState({ collapsed: !this.state.collapsed });
	};

	collapse = () => {
		this.setState({ collapsed: true });
	};

	render() {
		// const currentLayout = LayoutsStore.current;
		this.routes = LayoutsStore.getElementsByContentType(
			ContentTypes.ROUTERCONTENT
		).map((element) => ({
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
