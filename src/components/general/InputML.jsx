import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../store/layouts";

import { ButtonsGroup } from "./Window";

class InputML extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentLang: props.currentLang || "en",
			content: props.langContent || {},
		};

		this.makeLangFields();
	}

	componentDidUpdate(prevProps) {
		if (this.props.langContent !== prevProps.langContent) {
			this.setState({
				content: this.props.langContent || {},
			});
			this.makeLangFields();
		}
	}

	makeLangFields() {
		// creating content fields for non-existent languages
		const layoutLangList = LayoutsStore.current.langs;
		let newContent = this.state.contentLang || {};
		for (const lang of layoutLangList) {
			if (!newContent[lang.symbol]) newContent[lang.symbol] = "";
			// else newContent[lang] = this.state.contentLang[lang];
		}
		this.setState({ contentLang: newContent });
	}

	getContent = (lang) => {
		let ctn = this.state.content[lang] || "";

		return ctn;
	};

	setContent = (e) => {
		const ctn = e.currentTarget.value;
		const content = { ...this.state.content };
		content[this.state.currentLang] = ctn;
		this.setState({ content });
		if (this.props.onUpdate) this.props.onUpdate(content);
	};

	langButtons(currentLang) {
		const layoutLangList = LayoutsStore.current.langs;
		return layoutLangList.map(({ symbol, name }) => {
			const isUsed = this.getContent(symbol).trim() !== "";
			return {
				icon: symbol,
				title: name,
				className: symbol === currentLang ? "active" : "",
				style: { fontWeight: isUsed ? "bold" : "normal" },
				onClick: (e) => {
					this.setState({ currentLang: symbol });
				},
				enabled: !this.props.disabled,
			};
		});
	}

	render() {
		const { name, label, disabled } = this.props;
		const { currentLang } = this.state;

		const updateChildrenWithProps = React.Children.map(
			this.props.children,
			(child, i) => {
				if (child)
					return React.cloneElement(child, {
						//this properties are available as a props in child components
						id: name,
						disabled: disabled,
						value: this.getContent(currentLang),
						onChange: this.setContent,
					});
				else return null;
			}
		);

		return (
			<React.Fragment>
				<div className="d-flex flex-row justify-content-between align-items-center full-width">
					<label htmlFor={name}>{label}</label>
					<ButtonsGroup
						className="group-button"
						style={{ marginLeft: "auto" }}
						onlyIcons={true}
						buttons={this.langButtons(currentLang)}
					/>
				</div>
				{updateChildrenWithProps}
			</React.Fragment>
		);
	}
}

export default observer(InputML);
