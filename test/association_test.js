const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
    let joe, blogPost, comment;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({
            title: 'JS is great',
            content: '!!!'
        });
        comment = new Comment({ content: 'Yep, it really is'});

        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        // mongoose will automatically only push in the ObjectId even though we pushed the entire model! Thanks to the schema setup.
        comment.user = joe;
        // Likewise here, mongoose intercepts this assignment and assigns only the ObjectId to comment.user.

        // Using ES6 Promise.all for parallel db operations.
        Promise.all([ joe.save(), blogPost.save(), comment.save() ])
            .then(() => done());
    });

    // it.only runs this test in isolation
    it('saves a relation between a user and a blog post', (done) => {
        User.findOne({ name: 'Joe' })
            .populate('blogPosts')
            .then((user) => {
                assert(user.blogPosts[0].title === 'JS is great');
                done();
            })
    });

    it('saves a full relation graph', (done) => {
        User.findOne({ name: 'Joe' })
            .populate({
                path: 'blogPosts',
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'user',
                        model: 'user'
                    }
                }
            })
            .then((user) => {
                // console.log(user.blogPosts[0].comments[0]);
                assert(user.name === 'Joe');
                assert(user.blogPosts[0].title === 'JS is great');
                assert(user.blogPosts[0].comments[0].content === 'Yep, it really is');
                assert(user.blogPosts[0].comments[0].user.name === 'Joe');
                done();
            });
    });

});
