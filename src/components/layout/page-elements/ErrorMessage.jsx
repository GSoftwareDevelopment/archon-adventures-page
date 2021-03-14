import { JournalX as IconJournalX } from "react-bootstrap-icons";
import MarkdownView from "react-showdown";

export default function ErrorMessage({ message, ...props }) {
	return (
		<div className="warning">
			<IconJournalX size="32" />
			<MarkdownView markdown={message} />
		</div>
	);
}
