const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/posts - Public: all published posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .populate('replies.author', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id - Public: single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic')
      .populate('replies.author', 'name');
    if (!post || post.status === 'removed')
      return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts - Create post
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const image = req.file ? req.file.filename : '';
    const post = await Post.create({
      title,
      body,
      image,
      author: req.user._id
    });
    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id - Edit post
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorized' });
    if (req.body.title) post.title = req.body.title;
    if (req.body.body) post.body = req.body.body;
    if (req.file) post.image = req.file.filename;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 💬 REPLY
router.post('/:id/reply', protect, memberOrAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post || post.status === 'removed')
      return res.status(404).json({ message: 'Post not found' });
    post.replies.push({
      text,
      author: req.user._id
    });
    await post.save();
    await post.populate('replies.author', 'name');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❤️ LIKE / UNLIKE (legacy, keep for backward compatibility)
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.status === 'removed')
      return res.status(404).json({ message: 'Post not found' });
    const userId = req.user._id;
    const alreadyLiked = post.likes.some(id => id.toString() === userId.toString());
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ NEW: REACTION ENDPOINT (supports heart, like, laugh with separate counts)
router.post('/:id/react', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.status === 'removed')
      return res.status(404).json({ message: 'Post not found' });

    const { reaction } = req.body; // 'heart', 'like', or 'laugh'
    const userId = req.user._id;

    if (!['heart', 'like', 'laugh'].includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    // Find existing reaction from this user
    const existingIndex = post.userReactions.findIndex(
      r => r.user.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      const oldReaction = post.userReactions[existingIndex].type;
      if (oldReaction === reaction) {
        // Optional: toggle (remove reaction) – uncomment if you want that behavior
        // post.reactions[oldReaction] -= 1;
        // post.userReactions.splice(existingIndex, 1);
        // await post.save();
        // return res.json(post);
        // For now, do nothing (ignore duplicate)
        return res.json(post);
      } else {
        // Change reaction: decrement old, increment new
        post.reactions[oldReaction] -= 1;
        post.reactions[reaction] += 1;
        post.userReactions[existingIndex].type = reaction;
      }
    } else {
      // New reaction
      post.reactions[reaction] += 1;
      post.userReactions.push({ user: userId, type: reaction });
    }

    await post.save();
    await post.populate('author', 'name profilePic');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;