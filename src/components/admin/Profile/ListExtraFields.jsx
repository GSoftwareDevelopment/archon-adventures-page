import React, { useState } from "react";
import { extraFieldsDef } from "../../../libs/profileFields";
import * as Messages from "../../../libs/Messages.js";

import { Input } from "../../general/Window";
import MarkdownView from "react-showdown";

import {
	PencilSquare as IconEdit,
	Trash as IconDelete,
	EyeFill as IconVisible,
	EyeSlashFill as IconInvisible,
	ThreeDotsVertical as IconTools,
} from "react-bootstrap-icons";
import NewExtraField from "./NewExtraField";

function ListExtraFields({
	fields,
	visibility,
	onChange,
	onDelete,
	onToggleVisibility,
}) {
	const [fieldVisibility, setFieldVisibility] = useState(visibility || []);
	const [inEdit, setInEdit] = useState("");
	const [toolField, setToolField] = useState("");

	const toggleVisibility = (fieldName) => {
		let v = fieldVisibility;
		if (v.includes(fieldName)) {
			v = v.filter((f) => f !== fieldName);
		} else {
			v = [...v, fieldName];
		}
		setFieldVisibility(v);
		if (onToggleVisibility) onToggleVisibility(v);
	};

	return extraFieldsDef.map((field) => {
		if (fields[field.name]) {
			const isVisible = fieldVisibility.includes(field.name);

			if (field.name === inEdit) {
				return (
					<NewExtraField
						isEdit={true}
						fieldName={field.name}
						fieldValue={fields[field.name]}
						onCancel={(e) => {
							e.preventDefault();
							setInEdit("");
						}}
						onOK={(data) => {
							setInEdit("");
							if (onChange) onChange(data);
						}}
					/>
				);
			} else
				return (
					<div key={field.name} className="extra-field">
						<div className="row">
							<div className="field">
								<button
									onClick={(e) => {
										e.preventDefault();
										toggleVisibility(field.name);
									}}
									title={Messages.getText(
										"admin.account.profile.extraFields.button.visibility.tip"
									)}
								>
									{isVisible ? (
										<IconVisible size="1.5em" color="#ff0" />
									) : (
										<IconInvisible size="1.5em" color="#000" />
									)}
								</button>
								{field.type === "textarea" ? (
									<div>
										<label>{field.title}</label>
										<MarkdownView
											className="text"
											markdown={fields[field.name]}
										/>
									</div>
								) : (
									<Input
										noWrapLabel
										label={field.title}
										readOnly
										value={fields[field.name]}
									/>
								)}
							</div>
							<button
								onClick={(e) => {
									e.preventDefault();
									if (toolField === field.name) setToolField("");
									else setToolField(field.name);
								}}
							>
								<IconTools size="1.5em" />
							</button>
						</div>
						{field.name === toolField && (
							<div className="control-buttons">
								<button
									title={Messages.getText(
										"admin.account.profile.extraFields.button.edit.tip"
									)}
									onClick={(e) => {
										e.preventDefault();
										setInEdit(field.name);
									}}
								>
									<IconEdit size="1.5em" color="#0f0" />
								</button>
								<button
									onClick={(e) => {
										e.preventDefault();
										onDelete(field.name);
									}}
									title={Messages.getText(
										"admin.account.profile.extraFields.button.delete.tip"
									)}
								>
									<IconDelete size="1.5em" color="#f00" />
								</button>
							</div>
						)}
					</div>
				);
		} else return null;
	});
}

export default ListExtraFields;
