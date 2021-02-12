//

export const basicFieldsDef = [
	{ name: "displayName", title: "Display name:", type: "text" },
	{ name: "firstName", title: "First name:", type: "text" },
	{ name: "lastName", title: "Last name:", type: "text" },
	{ name: "imageURL", title: "Image URL:", type: "text" },
];

//

export const extraFieldsDef = [
	{
		name: "gender",
		title: "Gender",
		type: "select",
		options: ["male", "female", "other"],
		placeholder: "Choice...",
	},
	{ name: "birthday", title: "Birthday date", type: "date" },
	{
		name: "about",
		title: "About",
		type: "textarea",
		placeholder: "Type some information about you...",
	},
	{
		name: "country",
		title: "County",
		type: "text",
		placeholder: "Your country",
	},
	{ name: "city", title: "City", type: "text", placeholder: "Your city" },
	{
		name: "email",
		title: "eMail",
		type: "email",
		placeholder: "name@example.com",
	},
	{
		name: "social-FB",
		title: "Facebook",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-LinkedIn",
		title: "Linked In",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-Tinder",
		title: "Tinder",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-Instagram",
		title: "Instagram",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-Twitter",
		title: "Twitter:",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-YouTube",
		title: "YouTube",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-Skype",
		title: "Skype",
		type: "text",
		placeholder: "Full URL to your account...",
	},
	{
		name: "social-GitHub",
		title: "GitHub",
		type: "text",
		placeholder: "Full URL to your account...",
	},
];
