import React, { Component, useState } from "react";
import { observer } from "mobx-react";
import LayoutsStore, { Status } from "../../../store/layouts";
import "../scss/select-list.scss";

import Window, { Input, ButtonsGroup, SelectList } from "../../general/Window";
import * as Icon from "react-bootstrap-icons";
import { Upload as IconSave } from "react-bootstrap-icons";
import Alert from "../../layout/Alert";

class PropsOfLayout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.name,
			default: props.default,
			defaultLang: props.defaultLang,
			langs: props.langs.map((entry) => ({
				symbol: entry.symbol,
				name: entry.name,
			})),
		};
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

	save = (e) => {
		e.preventDefault();

		LayoutsStore.updateElementAttr(this.props._id, {
			name: this.state.name,
			default: this.state.default,
			langs: this.state.langs,
			defaultLang: this.state.defaultLang,
		});
	};

	render() {
		return (
			<Window
				className="window"
				title="Property of layout"
				onClose={this.props.onClose}
			>
				<Input
					className="justify-between hover"
					type="text"
					name="name"
					label="Name:"
					value={this.state.name}
					onChange={(e) => {
						this.setState({ name: e.currentTarget.value });
					}}
				/>
				<Input
					className="justify-between hover"
					type="checkbox"
					name="default"
					label="is default layout:"
					checked={this.state.default}
					onChange={(e) => {
						this.setState({ default: e.currentTarget.checked });
					}}
				/>
				<fieldset>
					<legend>Languages:</legend>
					<ManageLangs
						langs={this.state.langs}
						default={this.state.defaultLang}
						onAdd={this.onAddLang}
						onDelete={this.onDeleteLang}
					/>
				</fieldset>
				<ButtonsGroup
					className="group-button justify-right"
					style={{ marginBottom: "5px" }}
					onlyIcons={true}
					buttons={[
						{
							icon: <IconSave />,
							tip: "Save",
							onClick: this.save,
							enabled:
								LayoutsStore.currentStatus !== Status.SILENT ||
								LayoutsStore.currentStatus === Status.WARN,
						},
					]}
				/>
			</Window>
		);
	}
}

export default observer(PropsOfLayout);

export class ManageLangs extends Component {
	state = {
		visibleControls: "main-buttons", // main-buttons/add-lang/del-confirm
		choiced: "",
	};

	activeAddLang = (e) => {
		if (e) e.preventDefault();
		this.setState({
			choiced: "",
			visibleControls: "add-lang",
		});
	};

	activeDelLang = (e) => {
		if (e) e.preventDefault();
		this.setState({ visibleControls: "del-confirm" });
	};

	activeLangButtons = (e) => {
		if (e) e.preventDefault();
		this.setState({
			choiced: "",
			visibleControls: "main-buttons",
		});
	};

	onAddLang = (newLang) => {
		const { symbol, name } = newLang;
		if (this.props.onAdd) this.props.onAdd({ symbol, name });
		this.activeLangButtons();
	};

	onDelLang = (e) => {
		if (this.props.onDelete) this.props.onDelete(this.state.choiced);
		this.activeLangButtons(e);
	};

	validateNewLang = (newLangSymbol, newLangName) => {
		const symbol = newLangSymbol.trim().toLowerCase();
		const name = newLangName.trim();

		const isUnique =
			this.props.langs.find((entry) => entry.symbol === symbol) === undefined;
		return symbol !== "" && name !== "" && isUnique;
	};

	onRenderListItem = ({ symbol, name }, { lastItem }) => {
		symbol = symbol.toLowerCase();
		const isDefault = symbol === this.props.default;
		const isChoiced = symbol === this.state.choiced;

		return {
			isChoiced,
			item: (
				<React.Fragment>
					<span style={{ width: "30px" }}>{symbol}</span>
					<span>
						{name}
						{isDefault ? " (default)" : ""}
					</span>
				</React.Fragment>
			),
			after:
				this.state.visibleControls === "del-confirm"
					? isChoiced && (
							<DelConfirm
								onConfirm={this.onDelLang}
								onCancel={this.activeLangButtons}
							/>
					  )
					: this.state.visibleControls === "add-lang" &&
					  lastItem && (
							<NewItem
								onOK={this.onAddLang}
								onCancel={this.activeLangButtons}
								onValidate={this.validateNewLang}
							/>
					  ),
		};
	};

	render() {
		const isChoiced = this.state.choiced !== "";
		const isChoicedAreDefault = this.state.choiced === this.props.default;

		const buttons = [
			{
				icon: <Icon.PlusCircle />,
				title: "Add",
				onClick: this.activeAddLang,
				enabled: true,
			},
			{
				icon: <Icon.Trash />,
				title: "Delete",
				onClick: this.activeDelLang,
				enabled: isChoiced,
			},
			{
				icon: <Icon.Asterisk />,
				title: "Set Default",
				onClick: this.activeSetDefult,
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
						this.setState({
							choiced: item.symbol,
							visibleControls: "main-buttons",
						});
					}}
				/>
				{this.state.visibleControls === "main-buttons" && (
					<ButtonsGroup
						className="group-button group-vertical"
						onlyIcons={true}
						buttons={buttons}
					/>
				)}
			</div>
		);
	}
}

const NewItem = ({ onOK, onCancel, onValidate, props }) => {
	const [newLangSymbol, setNewLangSymbol] = useState("");
	const [newLangName, setNewLangName] = useState("");

	return (
		<div className="list-row">
			<Input
				name="symbol"
				type="text"
				maxLength="6"
				style={{ width: "30px" }}
				autoFocus
				value={newLangSymbol}
				onChange={(e) => {
					setNewLangSymbol(e.currentTarget.value);
				}}
			/>
			<Input
				name="name"
				type="text"
				maxLength="32"
				value={newLangName}
				onChange={(e) => {
					setNewLangName(e.currentTarget.value);
				}}
			/>
			<button
				className="green"
				disabled={!onValidate(newLangSymbol, newLangName)}
				onClick={(e) => {
					e.preventDefault();
					if (onOK)
						onOK({
							symbol: newLangSymbol.trim().toLowerCase(),
							name: newLangName.trim(),
						});
				}}
			>
				<Icon.Check2 />
			</button>
			<button
				className="red"
				onClick={(e) => {
					e.preventDefault();
					if (onCancel) onCancel();
				}}
			>
				<Icon.X />
			</button>
		</div>
	);
};

const DelConfirm = ({ onConfirm, onCancel, ...props }) => (
	<div className="list-row">
		<Alert
			className="info info-noBtn full-width"
			variant="error align-center"
			icon="Trash"
		>
			Confirm language removal?
			<div className="justify-between">
				<button
					className="red"
					onClick={(e) => {
						e.preventDefault();
						if (onConfirm) onConfirm(e);
					}}
				>
					Delete
				</button>
				<button
					onClick={(e) => {
						if (onCancel) onCancel(e);
					}}
				>
					Cancel
				</button>
			</div>
		</Alert>
	</div>
);
