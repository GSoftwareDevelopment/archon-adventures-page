import { useState } from "react";
import { extraFieldsDef } from "../../../libs/profileFields";
import * as Messages from "../../../libs/Messages.js";
import { toast } from "react-toastify";

import { Redirect } from "react-router-dom";
import NewExtraField from "./NewExtraField";
import ListExtraFields from "./ListExtraFields";

import { PlusCircle as IconAddField } from "react-bootstrap-icons";

function ExtraFields({
	fields,
	visibility,
	onChange,
	onToggleVisibility,
	onDelete,
}) {
	const [newField, setNewField] = useState(false);
	const [redirect, setRedirect] = useState(false);

	const excludeList = extraFieldsDef.map((field) =>
		fields[field.name] ? field.name : null
	);

	return (
		<fieldset className="extra-fieldset">
			<legend>{Messages.getText("admin.account.profile.extraFields")}</legend>
			<div className="info">
				{Messages.getTextAsMarkdown("admin.account.profile.extraFields.info")}
				<button
					onClick={(e) => {
						e.preventDefault();
						setNewField(!newField);
					}}
					disabled={newField}
				>
					<IconAddField size="1.5em" style={{ marginRight: "10px" }} />
					{Messages.getText(
						"admin.account.profile.extraFields.button.addField"
					)}
				</button>
			</div>

			{newField && (
				<NewExtraField
					excludeFields={excludeList}
					onCancel={(e) => {
						e.preventDefault();
						setNewField(false);
					}}
					onOK={(field) => {
						setNewField(false);
						toast.info(
							Messages.getTextAsMarkdown(
								"admin.account.profile.extraFields.toast.fieldCreated"
							)
						);
						onChange(field);
					}}
				/>
			)}

			<ListExtraFields
				fields={fields}
				visibility={visibility}
				onChange={(field) => {
					toast.info(
						Messages.getTextAsMarkdown(
							"admin.account.profile.extraFields.toast.fieldUpdated"
						)
					);
					onChange(field);
				}}
				onDelete={onDelete}
				onToggleVisibility={onToggleVisibility}
			/>

			<div className="footer-info">
				{Messages.getTextAsMarkdown(
					"admin.account.profile.extraFields.footerInfo"
				)}
				<button
					onClick={(e) => {
						e.preventDefault();
						setRedirect(true);
					}}
				>
					{Messages.getText(
						"admin.account.profile.extraFields.button.privacyPolicy"
					)}
				</button>
				{redirect && <Redirect to="/admin/policy/#privacy" />}
			</div>
		</fieldset>
	);
}

export default ExtraFields;
