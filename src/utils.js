export function pager (path, requester) {
	if (typeof path !== 'string') {
		return path;
	}
	const inheritedQuery = {};
	path.replace(/([^?=&]+)=([^&]*)/g, (s1, name, value) => {
		inheritedQuery[name] = value;
	});
	return function (query = {}) {
		const pagedQuery = Object.assign({}, query, inheritedQuery);
		return requester(pagedQuery);
	};
}