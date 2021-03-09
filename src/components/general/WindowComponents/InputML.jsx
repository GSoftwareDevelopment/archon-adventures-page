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
			contentLang: props.langContent,
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
		// debugger;
		// creating content fields for non-existent languages
		const layoutLangList = LayoutsStore.current.langs;
		let newContent = { ...this.props.langContent };
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

	setContent = (e, lang) => {
		const ctn = e.currentTarget.value;
		const contentLang = { ...this.state.contentLang };
		contentLang[lang] = ctn;
		this.setState({ contentLang });
		if (this.props.onUpdate) this.props.onUpdate(contentLang);
	};

	langButtons(currentLang) {
		const layoutLangList = [...LayoutsStore.current.langs];

		// add (if exists) language button from contentLang
		for (const cntLang in this.state.contentLang) {
			if (layoutLangList.findIndex(({ symbol }) => symbol === cntLang) === -1)
				layoutLangList.push({ symbol: cntLang });
		}

		return layoutLangList.map(({ symbol, name }) => {
			const isUsed = this.getContent(symbol).trim() !== "";
			let icon,
				title = "";
			if (name) {
				icon = symbol;
				title = name;
			} else {
				title =
					"This language will not be displayed because it is not defined in the Layout.";
				icon = (
					<React.Fragment>
						{symbol}
						<IconLangError color="#f00" style={{ marginLeft: "5px" }} />
					</React.Fragment>
				);
			}

			return {
				icon,
				title,
				className: symbol === currentLang ? "active" : "",
				style: { fontWeight: isUsed ? "bold" : "normal" },
				onClick: (e) => {
					this.setState({ currentLang: symbol });
					this.handleLangChange(symbol);
				},
				enabled: !this.props.disabled,
			};
		});
	}

	handleLangChange = (lang) => {
		if (this.props.onLangChange) {
			this.props.onLangChange(lang);
		}
	};

	render() {
		const { name, label, disabled } = this.props;
		const { currentLang } = this.state;

		const ChildrenWithProps = (lang) => {
			return React.Children.map(this.props.children, (child, i) => {
				if (child)
					return React.cloneElement(child, {
						//this properties are available as a props in child components
						id: name,
						disabled: disabled,
						value: this.getContent(lang),
						onChange: (e) => {
							this.setContent(e, lang);
						},
						onFocus: (e) => {
							this.handleLangChange(lang);
						},
					});
				else return null;
			});
		};

		return (
			<React.Fragment>
				{this.props.cloneChild ? (
					<React.Fragment>
						<div
							className="d-flex flex-column"
							style={{ gap: "5px", margin: "0 5px" }}
						>
							<label htmlFor={name}>{label}</label>
							{LayoutsStore.current.langs.map(({ symbol, name }) => (
								<div key={symbol} className="hover d-flex flex-row">
									<label
										htmlFor={`${name}-${symbol}`}
										style={{ width: "20px", textAlign: "right" }}
									>
										{symbol}
									</label>
									{ChildrenWithProps(symbol)}
								</div>
							))}
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div style={this.props.style}>
							<div
								className="d-flex flex-row justify-content-between align-items-center full-width"
								style={{ margin: "0 5px" }}
							>
								<label htmlFor={name}>{label}</label>
								<ButtonsGroup
									className="group-button"
									style={{ marginLeft: "auto" }}
									onlyIcons={true}
									buttons={this.langButtons(currentLang)}
								/>
							</div>
							{ChildrenWithProps(this.state.currentLang)}
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

export default observer(InputML);
