import {
	Stitch,
	AnonymousCredential,
	UserPasswordCredential,
	RemoteMongoClient,
	UserPasswordAuthProviderClient,
} from "mongodb-stitch-browser-sdk";
import { APP_ID, DB_NAME } from "../setup";

// Initialize the App Client
const client = Stitch.hasAppClient(APP_ID)
	? Stitch.getAppClient(APP_ID)
	: Stitch.initializeDefaultAppClient(APP_ID);

// Get a MongoDB Service Client
// This is used for logging in and communicating with Stitch
const mongodb = client.getServiceClient(
	RemoteMongoClient.factory,
	"mongodb-atlas"
);

// Get a reference to the database
const db = mongodb.db(DB_NAME);

const authorizeDB = async (credentials) => {
	if (credentials)
		credentials = new UserPasswordCredential(
			credentials.username,
			credentials.password
		);
	else credentials = new AnonymousCredential();
	const result = await client.auth.loginWithCredential(credentials);
	return result;
};

const isCurrentUserAnonymous = () => {
	const currentUser = client.auth.currentUser;
	return !currentUser || currentUser.loggedInProviderType === "anon-user";
};

const getProviderClient = () => {
	return client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
};

export { client, authorizeDB, db, isCurrentUserAnonymous, getProviderClient };
