// Content for Admin->Account->Profile

import { create } from "../Messages";

const base = "admin.account.profile";

create(`${base}.title`, { en: "Profile" });
create(`${base}.pendingData`, { en: "Need wait..." });

create(`${base}.basicInfo`, { en: "Basic information" });
create(`${base}.basicInfo.userRole`, { en: "Your role in system" });
//

create(`${base}.extraFields`, { en: "Extra fields" });
create(`${base}.extraFields.info`, {
	en: `
Define extra fields by clicking on **Add field...**, choice field type and fill nessesery information.

You can specify, which information you want to reveal logged-in users, by clicking / toggling the "Eye" icon.
`,
});
create(`${base}.extraFields.button.addField`, { en: "Add field..." });

create(`${base}.extraFields.button.edit.tip`, { en: "Edit field..." });
create(`${base}.extraFields.button.visibility.tip`, {
	en: "Toggle field visibility",
});
create(`${base}.extraFields.button.delete.tip`, { en: "Delete field..." });

create(`${base}.extraFields.toast.fieldCreated`, {
	en: `
**New field was created**

Don't forget update Profile!`,
});
create(`${base}.extraFields.toast.fieldUpdated`, {
	en: `
**Field was updated**

Don't forget update Profile!`,
});
create(`${base}.extraFields.toast.fieldDeleted`, {
	en: `
**Field was deleted**

Don't forget update Profile!`,
});

//

create(`${base}.newExtraField.fieldTypeSelect.placeholder`, {
	en: "Choice field type...",
});
create(`${base}.newExtraField.select.defaultPlaceholder`, { en: "Select..." });
create(`${base}.newExtraField.textarea.defaultPlaceholder`, {
	en: "Type text...",
});
create(`${base}.newExtraField.input.defaultPlaceholder`, {
	en: "Enter value...",
});
//

create(`${base}.security`, { en: "Security" });

create(`${base}.security.privacyPolicy`, {
	en: `
The information provided in the __Extra Fields__ section is __not available__ to persons who are not logged in.
`,
});
create(`${base}.security.button.privacyPolicy`, { en: "Privacy Policy..." });

create(`${base}.security.info`, { en: "" });
create(`${base}.security.button.resetPassword`, { en: "Reset password..." });

//

create(`${base}.button.updateProfile`, { en: "Update" });
create(`${base}.button.updateProgress`, { en: "Updating..." });
