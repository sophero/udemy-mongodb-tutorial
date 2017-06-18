const assert = require('assert');
// const mongoose = require('mongoose');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middleware', () => {
    let joe, blogPost;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({
            title: 'JS is great',
            content: '!!!'
        });
        joe.blogPosts.push(blogPost);

        Promise.all([ joe.save(), blogPost.save() ])
            .then(() => done());
    });

    it('users clean up dangling blogposts on remove', (done) => {
        joe.remove()
            .then(() => BlogPost.count())
            .then((count) => {
                assert(count === 0);
                done();
            });
    });

});
