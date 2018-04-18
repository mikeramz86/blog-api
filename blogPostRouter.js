const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blogposts} = require('./models');

function lorem() {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    'Tempor nec feugiat nisl pretium fusce id velit. Mus mauris vitae ultricies leo integer malesuada.' +
    'Ut sem nulla pharetra diam sit amet nisl suscipit.' +
    'Consectetur adipiscing elit pellentesque habitant morbi.'
};

//--------GET ENDPOINT------
Blogposts.create (
    'First Blog Title', lorem(), 'John Smith');
Blogposts.create (
    'Second Blog Post', lorem(), 'Jane Doe'
);

router.get('/', (req, res) => {
    res.json(Blogposts.get());
});

//--------POST ENDPOINT------

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = Blogposts.create(
        req.body.title, req.body.content, req.body.author);
    res.status(201).json(item)
});

//--------POST ENDPOINT------

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = [
        'id', 'title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(204).end();
  });

  //--------DELETE ENDPOINT------

  router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post with id \`${req.params.ID}\``);
    res.status(204).end();
  });
  
  module.exports = router;

