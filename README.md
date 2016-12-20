# NationBuilder Node SDK

_This is a quick reference for usage and design. This should "just get the point across"..._

### Usage
The SDK is _required_ as a constructor function. The constructor has two
parameters: slug and authenticator. The slug is the NationBuilder subdomain
associated with the account for which the SDK connects. The authenticator is the
object used by resource requests to pre-authenticate a request - currently
`BasicAuth` is the only supported authentication scheme.


```javascript
// require
const NationBuilder = require('nationbuilder-node');

// setup
const auth = NationBuilder.BasicAuth('my-test-token');
const nb = new NationBuilder('my-slug', auth);
```

After the NationBuilder SDK is instantiated. The resources methods can be accessed
via the pattern nb.[resource].[resource-method].

```javascript
nb.people.list({limit: 5})
    .then(list => {
        // first page of people: 5 per
        console.log("people:", list.people);
        return list.next;
    })
    .then(list => {
        // second page of people...
    });
```
_For more examples checkout test/resources-people-test.js_


### Design
- src/index.js: the SDK facade; all the resources are linked here.
- src/resource.js: the common functionality for request, i.e. authenticating making a request
- src/resources/*.js: all the resource API definitions are defined here; this is where
new resources are added, i.e. all the NationBuilder resources models
- src/authenticators/*.js: the authenticators. Only BasicAuth is defined... OAuth
authenticators would be added here and should implement the same interface as BasicAuth