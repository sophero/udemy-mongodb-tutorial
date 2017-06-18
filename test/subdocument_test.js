const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {

    it('can create a subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [
                { title: 'First post' },
                { title: 'Second post' }
            ]});
        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts[0].title === 'First post');
                done();
            });
    });

    it('can add subdocuments to an existing record', (done) => {
        const joe = User({
            name: 'Joe',
            posts: []
        });
        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            // fat arrow function without curly braces - implicit return line.
            .then((user) => {
                user.posts.push({ title: 'New post' });
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts[0].title === 'New post');
                done();
            });
    });

    it('can remove an existing subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ title: 'New title' }]
        });
        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                user.posts[0].remove();
                // subdoc.remove is a mongoose method. does not save operation on the database.
                // different to doc.remove() which actually does remove the record from the database.
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts.length === 0);
                done();
            });
    });

});
