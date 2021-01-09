import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./components/layout/main.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/layout/Login";
import UserInfo from "./components/layout/Userinfo";

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<UserInfo />
			<Switch>
				<Route key="authorize" exact path="/auth" component={Login} />
				<App />
			</Switch>
		</Router>
	</React.StrictMode>,
	document.getElementById("root")
);
