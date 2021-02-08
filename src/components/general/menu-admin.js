import { SIZE_PROP } from "./menu";
import {
	ClipboardData as IconDashboard,
	Back as IconBackToPage,
	BoxArrowLeft as IconLogout,
} from "react-bootstrap-icons";

export const menuAdmin = [
	{
		id: "backToSite",
		icon: <IconBackToPage size={SIZE_PROP} />,
		name: "Back to Site Manager",
		redirectTo: "/",
	},
	{
		id: "dashboard",
		icon: <IconDashboard size={SIZE_PROP} />,
		name: "Dashboard",
		redirectTo: "/dashboard",
	},
	{
		id: "logoutUser",
		icon: <IconLogout size={SIZE_PROP} />,
		name: "Logout User",
		style: { marginTop: "auto" },
	},
];
