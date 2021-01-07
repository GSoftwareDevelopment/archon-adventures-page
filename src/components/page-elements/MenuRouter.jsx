import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

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
		this.routes = LayoutsStore.getSchema()
			.filter((part) => part.contentType === "router-content")
			.map((part) => ({
				id: part.id,
				path: part.path,
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
			<nav id="main-menu" className={this.state.collapsed ? "collapsed" : ""}>
				<ul className="menu-pane">
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
