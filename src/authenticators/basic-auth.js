export default function BasicAuth (accessToken) {
	this._accessToken = accessToken;
}

BasicAuth.prototype = {
	constructor: BasicAuth,

	authenticateRequest (nationBuilder, resourcePath) {
		const urlQuery = { access_token: this._accessToken };
		const headers = {};
		return Promise.resolve({urlQuery, headers});
	},
}