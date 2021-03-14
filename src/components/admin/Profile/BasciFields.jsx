import { basicFieldsDef } from "../../../libs/profileFields";
import UsersStore from "../../../store/users";
import * as Messages from "../../../libs/Messages.js";

import { Input } from "../../general/Window";

function BasicFields({ fields, onChange }) {
	return (
		<fieldset className="basic-fieldset">
			<legend>{Messages.getText("admin.account.profile.basicInfo")}</legend>
			<div>
				<Input
					style={{
						textAlign: "center",
						marginBottom: "10px",
					}}
					inputStyle={{ textAlign: "center" }}
					key="role"
					type="text"
					name="role"
					label={Messages.getText("admin.account.profile.basicInfo.userRole")}
					noWrapLabel
					value={UsersStore.userRole || ""}
					readOnly
					disabled
				/>
				<div
					className="user-photo"
					style={{ backgroundImage: `url(${fields.imageURL})` }}
				/>
			</div>
			<div className="fields">
				{basicFieldsDef.map((field) => (
					<Input
						style={{ marginBottom: "10px" }}
						key={field.name}
						type={field.type}
						name={field.name}
						label={field.title}
						value={fields[field.name] || ""}
						onChange={(e) =>
							onChange({ field: field.name, value: e.currentTarget.value })
						}
						maxLength="64"
					/>
				))}
			</div>
		</fieldset>
	);
}

export default BasicFields;
