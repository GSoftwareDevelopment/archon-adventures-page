import AtariLogo from "../../assets/AtariLogo.png";

const menuItems = [
	{
		title: <img src={AtariLogo} alt="Menu" style={{ maxHeight: "32px" }} />,
		refTo: null,
	},
	{
		title: "Introduction",
		refTo: "/",
		exact: true,
		elements: [
			{
				type: "card",
				name: "intro",
			},
		],
	},
	{
		title: "Calendar cards",
		refTo: "/calendar",
		elements: [{ type: "card", name: "calendar" }, { type: "calendar" }],
	},
	{
		title: "Screens",
		refTo: "/screens",
		elements: [
			{
				type: "card",
				name: "screens",
			},
		],
	},
	{
		title: "Download",
		refTo: "/download",
		elements: [
			{
				type: "card",
				name: "download",
			},
		],
	},
	{
		title: "About",
		refTo: "/about",
		elements: [
			{
				type: "card",
				name: "about",
			},
		],
	},
	{
		title: "Credits",
		refTo: "/credits",
		elements: [
			{
				type: "card",
				name: "credits",
			},
		],
	},
];

export default menuItems;
