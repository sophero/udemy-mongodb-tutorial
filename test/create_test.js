const assert = require('assert');
const User = require('../src/user');

// Done is optionally available to every it method
// If passed, must be called in the test spec/it block.

describe('Creating records', () => {
    it('saves a user', (done) => {
        const joe = new User({ name: 'Joe' });
        joe.save()
            .then(() => {
                // Has joe been saved successfully?
                assert(!joe.isNew);
                done();
            });
    });
});
