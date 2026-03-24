const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, propertyId } = req.body;

    if (req.user._id.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: 'You cannot message yourself' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      property: propertyId || null,
      message,
    });

    await newMessage.populate('sender', 'name email');
    await newMessage.populate('receiver', 'name email');

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations (inbox)
// @route   GET /api/messages
const getInbox = async (req, res) => {
  try {
    // Get all unique users this person has talked to
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    // Get unique conversations
    const conversations = [];
    const seen = new Set();

    for (const msg of messages) {
      const otherId =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();

      if (!seen.has(otherId)) {
        seen.add(otherId);
        conversations.push({
          user:
            msg.sender._id.toString() === req.user._id.toString()
              ? msg.receiver
              : msg.sender,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead,
          property: msg.property,
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation, getInbox, getUnreadCount };