import { useState } from "react";
import UsersStore from "../../../store/users";
import { getProviderClient } from "../../../libs/db";
import * as Messages from "../../../libs/Messages.js";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { ShieldLock as IconPolicy } from "react-bootstrap-icons";

function Security() {
	const [redirect, setRedirect] = useState(false);

	const handleResetPassword = (e) => {
		e.preventDefault();
		const user = UsersStore.getCurrentUser();
		const email = user.profile.data?.email;

		getProviderClient()
			.sendResetPasswordEmail(email)
			.then((result) => {
				toast.info(
					`A message with a link to reset the password has been sent to the e-mail ${email}`
				);
			});
	};

	return (
		<fieldset className="security">
			<legend>{Messages.getText("admin.account.profile.security")}</legend>
			<div className="info">
				{Messages.getTextAsMarkdown(
					"admin.account.profile.security.privacyPolicy"
				)}
				<button
					onClick={(e) => {
						e.preventDefault();
						setRedirect(true);
					}}
				>
					<IconPolicy size="1.5em" style={{ marginRight: "10px" }} />
					{Messages.getText(
						"admin.account.profile.security.button.privacyPolicy"
					)}
				</button>
				{redirect && <Redirect to="/admin/policy/#privacy" />}
			</div>
			<div className="info">
				{Messages.getTextAsMarkdown("admin.account.profile.security.info")}
				<button onClick={handleResetPassword}>
					{Messages.getText(
						"admin.account.profile.security.button.resetPassword"
					)}
				</button>
			</div>
		</fieldset>
	);
}

export default Security;
