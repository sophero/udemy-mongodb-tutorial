const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {

    it('Requires a user name', () => {
        const user = new User({ name: undefined });
        // user.validate((validationResult) => {
        // // for more complex operations you wanna do on your validationResults
        // });
        const validationResult = user.validateSync();
        // const message = validationResult.errors.name.message;
        const { message } = validationResult.errors.name; // utilizing ES6! nice
        assert(message === 'Name is required.');
    });

    it('requires a user\'s name to be longer than 1 character', () => {
        const user = new User({ name: 'X' });
        const validationResult = user.validateSync();
        const { message } = validationResult.errors.name;
        assert(message === 'Name must be longer than 1 character.');
    });

    it('disallows invalid records being saved', (done) => {
        const user = new User({ name: 'A' });
        user.save()
            .catch((validationResult) => {
                const { message } = validationResult.errors.name;
                assert(message === 'Name must be longer than 1 character.');
                done();
            })
    });

});
