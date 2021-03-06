// import your node modules
const express = require('express');
const cors = require('cors');
const db = require('./data/db.js');

// add your server code starting here
const server = express();

// Middleware
server.use(express.json());
server.use(cors());

// Requests

// GET all posts
server.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'The posts information could not be retrieved' });
  }
});

// GET single post
server.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    if (!post.length) {
      res.status(404).json({ message: 'That post does not exist' });
    } else {
      res.status(200).json({ ...post[0] });
    }
  } catch (error) {
    res.status(500).json({ error: 'There was an error' });
  }
});

// POST add new post
server.post('/api/posts', async (req, res) => {
  const postData = req.body;
  try {
    if (!postData.title || !postData.contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post.' });
    } else {
      const postId = await db.insert(postData);
      const post = await db.findById(postId.id);
      res.status(201).json({ ...post });
    }
  } catch (error) {
    res.status(500).json({
      error: 'There was an error while saving the post to the database'
    });
  }
});

// DELETE single post
server.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    const count = await db.remove(id);
    if (!count) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    } else {
      res.status(200).json({ ...post[0] });
    }
  } catch (error) {
    res.status(500).json({ error: 'The post could not be removed' });
  }
});

// PUT update a single post
server.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const postData = req.body;
  try {
    const count = await db.update(id, postData);
    const updatedPost = await db.findById(id);

    if (!count) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    } else if (!postData.title || !postData.contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post.' });
    } else {
      res.status(200).json({ ...updatedPost[0] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The post information could not be modified.' });
  }
});

server.listen(4000, () => console.log('Server started on port 4000'));
