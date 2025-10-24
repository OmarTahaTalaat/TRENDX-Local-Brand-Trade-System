const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    participants: [
      {
        user_id: {
          type: mongoose.Schema.ObjectId,
          required: true,
        },
        user_type: {
          type: String,
          enum: ['seller', 'customer', 'admin'],
          required: true,
        },
      },
    ],
    message_content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
