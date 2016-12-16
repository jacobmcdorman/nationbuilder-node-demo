

export default function Resource (nationBuilder) {
	this._nationBuilder = nationBuilder;
}

Resource.prototype = {
	constructor: Resource,
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