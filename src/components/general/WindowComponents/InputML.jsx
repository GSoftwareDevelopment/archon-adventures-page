import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore from "../../../store/layouts";

import { ExclamationDiamondFill as IconLangError } from "react-bootstrap-icons";
import ButtonsGroup from "./ButtonsGroup";

class InputML extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentLang: props.currentLang || "en",
			contentLang: {},
		};

		this.makeLangFields();
	}

	componentDidUpdate(prevProps) {
		if (this.props.langContent !== prevProps.langContent) {
			// this.setState({
			// 	contentLang: this.props.langContent || {},
			// });
			this.makeLangFields();
		}
	}

	makeLangFields() {
		// creating content fields for non-existent languages
		const layoutLangList = LayoutsStore.current.langs;
		let newContent = this.props.langContent || {};
		for (const lang of layoutLangList) {
			if (!newContent[lang.symbol]) newContent[lang.symbol] = "";
			// else newContent[lang] = this.state.contentLang[lang];
		}
		this.setState({ contentLang: newContent });
	}

	getContent = (lang) => {
		let ctn = this.state.contentLang[lang] || "";

		return ctn;
	};

	setContent = (e) => {
		const ctn = e.currentTarget.value;
		const contentLang = { ...this.state.contentLang };
		contentLang[this.state.currentLang] = ctn;
		this.setState({ contentLang });
		if (this.props.onUpdate) this.props.onUpdate(contentLang);
	};

	langButtons(currentLang) {
		const layoutLangList = [...LayoutsStore.current.langs];

		// add (if exists) language button from contentLang
		for (const cntLang in this.state.contentLang) {
			console.log(cntLang);
			if (layoutLangList.findIndex(({ symbol }) => symbol === cntLang) === -1)
				layoutLangList.push({ symbol: cntLang });
		}

		return layoutLangList.map(({ symbol, name }) => {
			const isUsed = this.getContent(symbol).trim() !== "";
			let title = "";
			if (name) {
				title = name;
			} else {
				title = "This language is not defined in Layout";
				symbol = (
					<React.Fragment>
						{symbol}
						<IconLangError color="#f00" style={{ marginLeft: "5px" }} />
					</React.Fragment>
				);
			}
			return {
				icon: symbol,
				title,
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
