const test = require('tape');
const NationBuilder = require('..');

const config = (process.env['NB_TEST'] || '').split(':');
const NB_SLUG = config[0];
const NB_TOKEN = config[1];

if (typeof NB_SLUG !== 'string' || typeof NB_TOKEN !== 'string') {
	throw Error('Test requires environment variable NB_TEST=<slug>:<test-token>');
}

test('People count.', (ti) => {
	ti.plan(1);

	const auth = new NationBuilder.BasicAuth(NB_TOKEN);
	const nb = new NationBuilder(NB_SLUG, auth);

	nb.people.count()
		.then(count => ti.ok(count > 0, 'More than one person counted.'))
		.catch(ti.error);
});

test('List people.', (ti) => {
	ti.plan(2);

	const nb = new NationBuilder(NB_SLUG, NB_TOKEN);

	nb.people.list({limit: 1})
		.then(list => {
			ti.ok(list.people.length === 1, 'Limited people count to 1.');
			return list.next();
		})
		.then(list => {
			ti.ok(list.people.length === 1, 'Paged to next 1 person.');
		})
		.catch(ti.error);
});

test('Retrieve a person with id 1.', (ti) => {
	ti.plan(1);

	const nb = new NationBuilder(NB_SLUG, NB_TOKEN);

	nb.people.retrieve(1)
		.then(result => {
			ti.ok(result.person, 'Found person with id 1');
		})
		.catch(ti.error);
});

test('Update person with id 1 and find person by phone number.', (ti) => {
	ti.plan(2);

	const nb = new NationBuilder(NB_SLUG, NB_TOKEN);
	const phone = `555-555-${String(new Date().getTime()).slice(-4)}`;

	nb.people.update(1, { person: {phone}})
		.then(result => {
			ti.equal(result.person.phone, phone, 'Updated person with id 1');
			return nb.people.find({phone: phone.split('-').join('')});
		})
		.then(result => {
			ti.equal(result.person.phone, phone, 'Found person with phone number');
		})
		.catch(ti.error);
});