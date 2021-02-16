import React, { useState } from "react";
import { extraFieldsDef } from "../../../libs/profileFields";
import * as Messages from "../../../libs/Messages.js";

import { Check2 as IconAddField, X as IconClose } from "react-bootstrap-icons";

function NewExtraField({
	isEdit,
	fieldName,
	fieldValue,
	excludeFields,
	onCancel,
	onOK,
}) {
	const [field, setField] = useState(fieldName || "");
	const [value, setValue] = useState(fieldValue || "");

	let fieldIndex;
	if (isEdit) {
		fieldIndex = extraFieldsDef.findIndex((f) => f.name === fieldName);
		if (fieldIndex !== -1) fieldIndex++;
		else fieldIndex = 0;
	} else fieldIndex = 0;

	const [index, setIndex] = useState(fieldIndex);

	return (
		<div className="new-extra-field">
			{Boolean(isEdit) ? (
				<div className="label">{extraFieldsDef[index - 1].title}</div>
			) : (
				<select
					className="field-type-select"
					autoFocus
					defaultValue=""
					onChange={(e) => {
						setValue("");
						setField(e.target.value);
						setIndex(e.target.selectedIndex);
					}}
				>
					<option disabled value="">
						{Messages.getText(
							"admin.account.profile.newExtraField.fieldTypeSelect.placeholder"
						)}
					</option>
					{extraFieldsDef.map((field) => {
						const disable = excludeFields && excludeFields.includes(field.name);
						return (
							<option key={field.name} disabled={disable} value={field.name}>
								{field.title}
							</option>
						);
					})}
				</select>
			)}
			{!index ? (
				<div className="filler" />
			) : (
				<React.Fragment>
					{extraFieldsDef[index - 1].type === "select" ? (
						<select defaultValue="" onChange={(e) => setValue(e.target.value)}>
							<option disabled value="">
								{extraFieldsDef[index - 1].placeholder ||
									Messages.getText(
										"admin.account.profile.newExtraField.select.defaultPlaceholder"
									)}
							</option>
							{extraFieldsDef[index - 1].options.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
					) : extraFieldsDef[index - 1].type === "textarea" ? (
						<textarea
							name="field-value"
							placeholder={
								extraFieldsDef[index - 1].placeholder ||
								Messages.getText(
									"admin.account.profile.newExtraField.textarea.defaultPlaceholder"
								)
							}
							value={value}
							onChange={(e) => setValue(e.currentTarget.value)}
							maxLength="1024"
						/>
					) : (
						<input
							name="field-value"
							type={extraFieldsDef[index - 1].type}
							placeholder={
								extraFieldsDef[index - 1].placeholder ||
								Messages.getText(
									"admin.account.profile.newExtraField.input.defaultPlaceholder"
								)
							}
							value={value}
							onChange={(e) => setValue(e.currentTarget.value)}
							maxLength="128"
						/>
					)}
				</React.Fragment>
			)}
			<div className="control-buttons">
				{index && value.trim() ? (
					<button
						onClick={(e) => {
							e.preventDefault();
							onOK({ field, value });
						}}
					>
						<IconAddField size="1.5em" color="#0F0" />
					</button>
				) : (
					<div style={{ width: "50px" }} />
				)}
				<button onClick={onCancel}>
					<IconClose size="1.5em" />
				</button>
			</div>
		</div>
	);
}

export default NewExtraField;
