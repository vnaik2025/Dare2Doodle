const sdk = require('node-appwrite');

const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
    .setKey(process.env.APPWRITE_API_KEY); // Your API Key

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);
const ID = sdk.ID;
const Query = sdk.Query; // <-- THIS is what you were missing

module.exports = {
    client,
    databases,
    storage,
    ID,
    Query
};
