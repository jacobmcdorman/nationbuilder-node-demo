import Resource from '../resource';
import { pager } from '../utils';

const { GETMethod, PUTMethod } = Resource;

export default Resource.extend({

	count: GETMethod({
		path: 'people/count',
		response: (res) => res['people_count'],
	}),

	list: GETMethod({
		path: 'people',
		response: function (res) {
			return {
				people: res['results'],
				next: pager(res['next'], this.list.bind(this)),
				prev: pager(res['prev'], this.list.bind(this)),
			};
		},
	}),

	retrieve: GETMethod({
		path: 'people/{id}',
		urlParams: ['id'],
	}),

	find: GETMethod({path: 'people/match'}),

	update: PUTMethod({
		path: 'people/{id}',
		urlParams: ['id'],
	}),

});