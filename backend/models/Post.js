const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['published', 'removed'],
    default: 'published'
  },
  
  // Keep old likes array for backward compatibility (optional)
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // NEW: reaction counters for each emoji type
  reactions: {
    heart: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 }
  },

  // NEW: track which user reacted with which reaction (prevents multiple counting)
  userReactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['heart', 'like', 'laugh'] }
  }],

  // Replies array
  replies: [
    {
      text: {
        type: String,
        required: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);