import * as resources from './resources';
import * as authenticators from './authenticators';

NationBuilder.DEFAULT_PROTOCOL = 'https';
NationBuilder.DEFAULT_HOST_TMPL = '{slug}.nationbuilder.com';
NationBuilder.DEFAULT_PORT = '443';
NationBuilder.DEFAULT_BASE_PATH = '/api/v1/';
NationBuilder.DEFAULT_TIMEOUT_MS = 120000;

Object.assign(NationBuilder, authenticators);


export function NationBuilder (slug, auth) {
	if (!(this instanceof NationBuilder)) {
		return new NationBuilder(slug, options);
	}

	this._api = {
		protocol: NationBuilder.DEFAULT_PROTOCOL,
		host: NationBuilder.DEFAULT_HOST_TMPL.replace(/^{slug}/, slug),
		port: NationBuilder.DEFAULT_PORT,
		basePath: NationBuilder.DEFAULT_BASE_PATH,
		timeout_ms: NationBuilder.DEFAULT_TIMEOUT_MS,
	};

	let resourceAuth = auth;
	if (typeof auth === 'string') {
		resourceAuth = new NationBuilder.BasicAuth(auth);
	}

	for (let name in resources) {
		this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this, resourceAuth);
	}
}

NationBuilder.prototype = {
	constructor: NationBuilder,

	getAPIField (field) {
		return this._api[field];
	},
};