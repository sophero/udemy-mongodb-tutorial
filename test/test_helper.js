const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// This is a hook - one that gets executed only once before the entire test suite is run.
before((done) => {
    mongoose.connect('mongodb://localhost/users_test');
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Error', error);
        });
});

// This is another hook, one which gets run before each test in the test suite is run.
// Drop takes a callback function that runs once drop is done.
beforeEach((done) => {
    const { users, comments, blogposts } = mongoose.connection.collections;
        // note that mongoDB normalizes collection names by making them uniformly lowercase
    users.drop(() => {
        comments.drop(() => {
            blogposts.drop(() => {
                done();
            });
        });
    });
});
