import { ICON_SIZE } from "../general/SidebarMenu";
import {
	ClipboardData as IconDashboard,
	Back as IconBackToPage,
	BoxArrowLeft as IconLogout,
} from "react-bootstrap-icons";

export const menu = [
	{
		id: "backToSite",
		icon: <IconBackToPage size={ICON_SIZE} />,
		name: "Back to Site Manager",
		redirectTo: "/",
	},
	{
		id: "dashboard",
		icon: <IconDashboard size={ICON_SIZE} />,
		name: "Dashboard",
		redirectTo: "/dashboard",
	},
	{
		id: "logoutUser",
		icon: <IconLogout size={ICON_SIZE} />,
		name: "Logout User",
		style: { marginTop: "auto" },
	},
];
