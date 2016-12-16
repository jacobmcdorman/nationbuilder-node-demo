const popsicle = require('popsicle');
import * as httpMethods from './http-methods';

const DEFAULT_RES_HANDLER = (res) => res;

export default function Resource (nationBuilder, auth, spec = {}) {
	this._nationBuilder = nationBuilder;
	this._auth = auth;
	this._spec = spec;
}

Object.assign(Resource, httpMethods);

Resource.prototype = {
	constructor: Resource,

	_request (method, resourcePath, options = {}) {

		return this._auth.authenticateRequest(this._nationBuilder, resourcePath)
			.then(({urlQuery, headers}) => {

				const requestHeaders = Object.assign({
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, headers, options.headers);

				const field = (name) => this._nationBuilder.getAPIField(name);
				const path = `${field('basePath')}${resourcePath}`;

				const requestOptions = {
					method: method,
					url: `${field('protocol')}://${field('host')}:${field('port')}${path}`,
					query: Object.assign(urlQuery, options.urlQuery),
					headers: requestHeaders,
					timeout: field('timeout_ms'),
					transport: popsicle.createTransport({type: 'text'}),
				};

				if (options.hasOwnProperty('body')) {
					requestOptions.body = options.body;
				}

				const responseProcessor = popsicle.plugins.parse(['json', 'urlencoded']);

				return popsicle.request(requestOptions).use(responseProcessor);
			})
			.then((res) => {
				return (options.responseHandler || DEFAULT_RES_HANDLER).call(this, res.body)
			});
	},

	spec (key) {
		if (arguments.length === 0) {
			return this._spec;
		}
		return this._spec[key];
	},

	hasSpec (key) {
		return this._spec.hasOwnProperty(key);
	},
};

Resource.extend = function (sub) {
	const parent = this;

	const constructor = sub.hasOwnProperty('constructor')
		? sub.constructor
		: function () { parent.apply(this, arguments); };
	Object.assign(constructor, parent);

	constructor.prototype = Object.create(parent.prototype);
	constructor.prototype.constructor = constructor;
	Object.assign(constructor.prototype, sub);

	return constructor;
}