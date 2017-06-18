const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
    let joe, maria, alex, zach;

    beforeEach((done) => {
        alex = new User({ name: 'Alex' });
        joe = new User({ name: 'Joe' });
        maria = new User({ name: 'Maria' });
        zach = new User({ name: 'Zach' });

        Promise.all([ joe.save(), alex.save(), maria.save(), zach.save() ])
            .then(() => done());
    });

    it('finds all users with a name of joe', (done) => {
        User.find({ name: 'Joe' })
            .then((users) => {
                // console.log(users[0]._id.toString(), joe.id);
                assert(users[0]._id.toString() === joe.id);
                done();
            });
    });

    it('find a user with a particular id', (done) => {
        User.findOne({ _id: joe.id })
            .then((user) => {
                // console.log(user);
                assert(user.name === "Joe");
                done();
            });
    });

    it('can skip and limit the result', (done) => {
        User.find({})
            .sort({ name: 1 })
            // key determines what to sort by, value 1 is ascending, value -1 descending order.
            .skip(1)
            .limit(2)
            .then((users) => {
                console.log(users);
                assert(users.length === 2);
                assert(users[0].name === 'Joe');
                assert(users[1].name === 'Maria');
                done();
            });
    })

});
