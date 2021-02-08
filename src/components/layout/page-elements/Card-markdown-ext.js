import * as BSIcon from "react-bootstrap-icons";

// showdown options
export const showdown_options = {
	tables: true,
	emoji: true,
	parseImgDimensions: true,
	literalMidWordUnderscores: true,
	strikethrough: true,
	simpleLineBreaks: true,
	openLinksInNewWindow: true,
	metadata: true,
};

//

function Icon({ ...props }) {
	const BootstrapIcon = BSIcon[props.name];
	if (BootstrapIcon) return <BootstrapIcon {...props} />;
	else return null;
}

function Align({ children, ...props }) {
	return (
		<span style={{ display: "block", textAlign: props.to }}>{children}</span>
	);
}

export const showdown_ext = { Icon, Align };
