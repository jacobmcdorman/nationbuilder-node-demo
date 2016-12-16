
const DEFAULT_SPEC = {
	method: 'GET',
	path: '',
	urlParams: [],
	mutating: false,
	responseHandler: (res) => res,
};

export function httpMethod (spec) {
	const {
		method,
		path,
		urlParams,
		hasBody,
	} = Object.assign({}, DEFAULT_SPEC, spec);
	
	return function (/** <params>, <body>, <query> **/) {
		const args = [].slice.call(arguments);

		// unpack params, body, and url-queries
		const params = {};
		const hasAllParams = urlParams.every((name) => {
			if (args.length === 0) {
				return false;
			}
			const aParam = params[name] = args.shift();
			return typeof aParam === 'string' || typeof aParam === 'number';
		});
		if (!hasAllParams) {
			return Promise.reject(new Error('The request does not have all required ' +
				`URL parameters. Required parameters are: ${urlParams.join(', ')}`));
		}

		let body = null;
		if (hasBody) {
			if (args.length === 0) {
				return Promise.reject(new Error('The request is missing a body.'));
			}
			body = args.shift();
		}

		const urlQuery = Object.assign({}, args.shift());

		// render resource-path
		const unrenderedParams = [];
		const resourcePath = path.replace(/{(.*?)}/g, (match, name) => {
			if (!params.hasOwnProperty(name)) {
				unrenderedParams.push(name);
				return match;
			}
			return params[name];
		});
		if (unrenderedParams.length > 0) {
			return Promise.reject(new Error('The request specification is missing' + 
				`URL parameter(s): ${unrenderedParams.join(', ')}`));
		}

		// build and execute request
		let responseHandler = DEFAULT_SPEC.responseHandler;
		if (spec.hasOwnProperty('response')) {
			responseHandler = spec.response;
		}
		else if (this.hasSpec('response')) {
			responseHandler = this.spec('response');	
		}

		const requestOptions = {
			urlQuery,
			responseHandler,
		};
		if (hasBody) {
			requestOptions.body = body;
		}

		return this._request(method, resourcePath, requestOptions);
	};
}

export function GETMethod (description) {
	return httpMethod(Object.assign({method: 'GET', hasBody: false}, description));
}

export function POSTMethod (description) {
	return httpMethod(Object.assign({method: 'POST', hasBody: true}, description));
}

export function PUTMethod (description) {
	return httpMethod(Object.assign({method: 'PUT', hasBody: true}, description));
}

export function DELETEMethod (description) {
	return httpMethod(Object.assign({method: 'DELETE', hasBody: true}, description));
}