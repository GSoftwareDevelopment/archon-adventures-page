import UsersStore from "../../../store/users";
import { getProviderClient } from "../../../libs/db";
import * as Messages from "../../../libs/Messages.js";

function Security() {
	// const [];
	const handleResetPassword = (e) => {
		e.preventDefault();
		const user = UsersStore.getCurrentUser();
		const email = user.profile.data?.email;
		console.log(email);
		getProviderClient().sendResetPasswordEmail(email);
	};

	return (
		<fieldset className="security">
			<legend>{Messages.getText("admin.account.profile.security")}</legend>
			<div>
				<div>
					{Messages.getTextAsMarkdown("admin.account.profile.security.info")}
				</div>
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
