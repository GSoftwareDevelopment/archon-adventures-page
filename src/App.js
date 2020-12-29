import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { client, authorizeDB } from "./libs/db";

import CustomScrollbar from "./components/layout/CustomScrollbar";
import Login, { Userinfo } from "./components/layout/Login";
import Header from "./components/layout/Header";
import ContentPage from "./components/layout/ContentPage";
import Footer from "./components/layout/Footer";
// import Page404 from "./components/layout/Page404";

class App extends Component {
	constructor() {
		super();
		this.state = { dbStatus: "pending" };
	}

	async componentDidMount() {
		await this.connect();
	}
	async connect() {
		try {
			if (!client.auth.currentUser) await authorizeDB();

			this.setState({ dbStatus: "anonymous" });
		} catch (error) {
			console.error(error);
			this.setState({ dbStatus: "error" });
		}
	}

	onChange = (status) => {
		switch (status) {
			case "anonymous":
				this.setState({ dbStatus: "anonymous" });
				this.connect();
				break;
			case "authorized":
				this.setState({ dbStatus: "authorized" });
				break;
			default:
				this.setState({ dbStatus: "error" });
				break;
		}
	};

	render() {
		switch (this.state.dbStatus) {
			case "anonymous":
			case "authorized":
				return (
					<Router>
						<CustomScrollbar style={{ width: "100vw", height: "100vh" }}>
							<Header />
							<ContentPage />
							<Switch>
								<Route path="/auth">
									<Login
										onAuthorized={() => {
											this.onChange("authorized");
										}}
									/>
								</Route>
								{/* <Route component={Page404} /> */}
							</Switch>
							<Footer />
							<Userinfo onChange={this.onChange} />
						</CustomScrollbar>
					</Router>
				);
			case "pending":
				return <div className="content-loader">Loading...</div>;
			default:
				return <div>Boot error</div>;
		}
	}
}

export default App;
