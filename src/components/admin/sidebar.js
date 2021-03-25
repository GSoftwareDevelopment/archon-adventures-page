import { ICON_SIZE } from "../general/SidebarMenu";
import {
	ClipboardData as IconDashboard,
	PersonBadge as IconAccount,
	ShieldShaded as IconPolicy,
	PeopleFill as IconUsers,
	Back as IconBackToPage,
} from "react-bootstrap-icons";

import Account from "./Account";

export const menu = [
	{
		id: "account",
		icon: <IconAccount size={ICON_SIZE} />,
		name: "Account",
		Component: Account,
	},
	{
		id: "dashboard",
		icon: <IconDashboard size={ICON_SIZE} />,
		name: "Dashboard",
		redirectTo: "/admin/dashboard",
	},
	{
		id: "policy",
		icon: <IconPolicy size={ICON_SIZE} />,
		name: "Policy Management",
		redirectTo: "/admin/policy",
	},

	{
		id: "users",
		icon: <IconUsers size={ICON_SIZE} />,
		name: "Users Management",
		redirectTo: "/admin/users",
	},
	{
		id: "backToSite",
		icon: <IconBackToPage size={ICON_SIZE} />,
		name: "Switch to Site Manager",
		style: { marginTop: "auto", marginBottom: "10px" },
		redirectTo: "/",
	},
];
