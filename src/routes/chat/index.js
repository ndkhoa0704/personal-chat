const express = require('express');
const chatCtrl = require('./chatCtrl');
const { authenticate } = require('../../middlewares/auth');

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

/**
 * @route POST /api/chat/conversations
 * @desc Create a new conversation
 * @access Private
 */
router.post('/conversations', chatCtrl.createConversation);

/**
 * @route GET /api/chat/conversations
 * @desc Get all conversations for the current user
 * @access Private
 */
router.get('/conversations', chatCtrl.getConversations);

/**
 * @route GET /api/chat/conversations/:conversationId/messages
 * @desc Get all messages for a conversation
 * @access Private
 */
router.get('/conversations/:conversationId/messages', chatCtrl.getMessages);

/**
 * @route DELETE /api/chat/conversations/:conversationId
 * @desc Delete a conversation
 * @access Private
 */
router.delete('/conversations/:conversationId', chatCtrl.deleteConversation);

/**
 * @route POST /api/chat/send
 * @desc Send a message to OpenAI and get a response
 * @access Private
 */
router.post('/send', chatCtrl.sendMessage);

module.exports = router;