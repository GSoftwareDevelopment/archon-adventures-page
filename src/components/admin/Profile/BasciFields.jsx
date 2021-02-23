import { basicFieldsDef } from "../../../libs/profileFields";
import UsersStore from "../../../store/users";
import * as Messages from "../../../libs/Messages.js";

import { Input } from "../../general/Window";

function BasicFields({ fields, onChange }) {
	return (
		<fieldset className="basic-fieldset">
			<legend>{Messages.getText("admin.account.profile.basicInfo")}</legend>
			<div
				className="user-photo"
				style={{ backgroundImage: `url(${fields.imageURL})` }}
			/>
			<div className="fields">
				<Input
					style={{
						display: "flex",
						justifyContent: "space-between",
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
				/>
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
