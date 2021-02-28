import "../scss/select-list.scss";

import React, { Component } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";
import WindowsStore from "../../../store/windows";

import { Input, ButtonsGroup, SelectList } from "../../general/Window";
import * as Icon from "react-bootstrap-icons";
import { Save as IconSave } from "react-bootstrap-icons";

import * as Messages from "../../../libs/Messages";

import AddLanguage from "./PropsOfLayout-AddLanguage";
import DeleteConfirmation from "./DeleteConfirmation";

const msg_base = "props.layout";

class PropsOfLayout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.attr.name,
			default: props.attr.default,
			defaultLang: props.attr.defaultLang,
			langs: props.attr.langs.map((entry) => ({
				symbol: entry.symbol,
				name: entry.name,
			})),
		};

		const { dialog } = props;

		dialog({
			className: "max-height",
			size: "panel",
			sizeCycle: ["panel", "minimized"],
			disableMaximize: true,
			title: Messages.getText(`${msg_base}.window.title`),
		});
	}

	onAddLang = (newEntry) => {
		const langs = this.state.langs;

		// if languages list is empty, set added new lang as default
		if (langs.length === 0) this.setState({ defaultLang: newEntry.symbol });

		this.setState({ langs: [...langs, newEntry] });
	};

	onDeleteLang = (langSymbol) => {
		const newLangs = this.state.langs.filter(
			(entry) => entry.symbol !== langSymbol
		);
		this.setState({ langs: newLangs });
	};

	onSetDefault = (langSymbol) => {
		if (
			this.state.langs.findIndex(({ symbol }) => symbol === langSymbol) === -1
		) {
			return;
		}
		this.setState({ defaultLang: langSymbol });
	};

	save = (e) => {
		e.preventDefault();

		LayoutsStore.updateElementAttr(this.props.attr._id, {
			name: this.state.name,
			default: this.state.default,
			langs: this.state.langs,
			defaultLang: this.state.defaultLang,
		});
	};

	render() {
		return (
			<React.Fragment>
				<Input
					className="justify-between hover"
					type="text"
					name="name"
					label={Messages.getText(`${msg_base}.name`)}
					tip={Messages.getText(`${msg_base}.name.tip`)}
					value={this.state.name}
					onChange={(e) => {
						this.setState({ name: e.currentTarget.value });
					}}
				/>
				<fieldset style={{ minHeight: "200px" }}>
					<legend>{Messages.getText(`${msg_base}.languageList.title`)}</legend>
					<ManageLangs
						langs={this.state.langs}
						default={this.state.defaultLang}
						onAdd={this.onAddLang}
						onDelete={this.onDeleteLang}
						onSetDefault={this.onSetDefault}
						dialogId={this.props.attr._id}
					/>
				</fieldset>
				<ButtonsGroup
					className="window-footer group-button"
					onlyIcons={false}
					buttons={[
						{
							style: { marginRight: "auto" },
							title: Messages.getText(`${msg_base}.button.setAsDefault`),
							tip: Messages.getText(`${msg_base}.button.setAsDefault.tip`),
							onClick: (e) => {
								this.setState({ default: e.currentTarget.checked });
							},
						},
						{
							icon: <IconSave size="1.5em" />,
							title: Messages.getText(`props.save`),
							tip: Messages.getText(`props.save.tip`),
							onClick: this.save,
							enabled:
								LayoutsStore.currentStatus !== Status.SILENT ||
								LayoutsStore.currentStatus === Status.WARN,
						},
					]}
				/>
			</React.Fragment>
		);
	}
}

export default observer(PropsOfLayout);

export class ManageLangs extends Component {
	state = {
		visibleControls: "main-buttons", // main-buttons/add-lang/del-confirm
		choiced: "",
	};

	onAddLang = (e) => {
		if (e) e.preventDefault();
		this.setState({
			choiced: "",
		});
		WindowsStore.addWindow(
			"add-language",
			AddLanguage,
			{
				actions: [
					// TODO:	Niepodoba mi się ta forma definicji akcji :/
					(newLang) => {
						if (this.props.onAdd) this.props.onAdd(newLang);
					},
				],
			},
			this.props.dialogId
		);
	};

	onDelLang = (e) => {
		if (e) e.preventDefault();

		const lang = this.state.choiced.trim();
		const language = this.props.langs.find((l) => l.symbol === lang);
		WindowsStore.addWindow(
			"delete-language",
			DeleteConfirmation,
			{
				item: language.name,
				actions: [
					// TODO:	Niepodoba mi się ta forma definicji akcji :/
					() => {
						this.setState({ choiced: "" });
						if (this.props.onDelete) this.props.onDelete(lang);
						return true;
					},
				],
			},
			this.props.dialogId
		);
	};

	onSetDefault = (e) => {
		if (this.props.onSetDefault) this.props.onSetDefault(this.state.choiced);
	};

	onRenderListItem = ({ symbol, name }, { lastItem }) => {
		symbol = symbol.toLowerCase();
		const isDefault = symbol === this.props.default;
		const isChoiced = symbol === this.state.choiced;

		return {
			isChoiced,
			item: (
				<React.Fragment>
					<span style={{ width: "40px", textAlign: "center" }}>{symbol}</span>
					<span>
						{name}
						{isDefault ? " (default)" : ""}
					</span>
				</React.Fragment>
			),
		};
	};

	render() {
		const isChoiced = this.state.choiced !== "";
		const isChoicedAreDefault = this.state.choiced === this.props.default;

		const buttons = [
			{
				icon: <Icon.PlusCircle />,
				title: Messages.getText(`${msg_base}.languageList.button.add`),
				tip: Messages.getText(`${msg_base}.languageList.button.add.tip`),
				onClick: this.onAddLang,
				enabled: true,
			},
			{
				icon: <Icon.Trash />,
				title: Messages.getText(`${msg_base}.languageList.button.delete`),
				tip: Messages.getText(`${msg_base}.languageList.button.delete.tip`),
				onClick: this.onDelLang,
				enabled: isChoiced,
			},
			{
				icon: <Icon.Asterisk />,
				title: Messages.getText(`${msg_base}.languageList.button.setAsDefault`),
				tip: Messages.getText(
					`${msg_base}.languageList.button.setAsDefault.tip`
				),
				onClick: this.onSetDefault,
				enabled: isChoiced && !isChoicedAreDefault,
			},
		];

		return (
			<div className="justify-left align-items-start">
				<SelectList
					className="full-width"
					list={this.props.langs}
					onItemRender={this.onRenderListItem}
					onChoice={(item) => {
						this.setState({ choiced: item.symbol });
					}}
				/>
				<ButtonsGroup
					className="group-button group-vertical"
					onlyIcons={false}
					iconAlign="right"
					buttons={buttons}
				/>
			</div>
		);
	}
}
