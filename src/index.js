import "./components/layout/main.scss";
import "./components/layout/messages-init";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
