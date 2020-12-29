import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./components/layout/main.scss";
import "./components/layout/markdown.scss";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
