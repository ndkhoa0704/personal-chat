const openai = require('../../configs/openai');
const Chat = require('../../models/chat');
const User = require('../../models/user');

/**
 * Create a new conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createConversation = async (req, res, next) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;

        const conversation = await Chat.createConversation(userId, title);

        return res.status(201).json({
            success: true,
            data: {
                conversation
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all conversations for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getConversations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const conversations = await Chat.getConversations(userId);

        return res.status(200).json({
            success: true,
            data: {
                conversations
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all messages for a conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const messages = await Chat.getMessages(conversationId, userId);

        return res.status(200).json({
            success: true,
            data: {
                messages
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteConversation = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const success = await Chat.deleteConversation(conversationId, userId);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found or not owned by user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Send a message to OpenAI and get a response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const sendMessage = async (req, res, next) => {
    try {
        const { message, conversationId } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID is required'
            });
        }

        // Get previous messages for this conversation
        const previousMessages = await Chat.getMessages(conversationId, userId);

        // Format messages for OpenAI API
        const formattedMessages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...previousMessages.map(msg => ({ role: msg.role, content: msg.message })),
            { role: 'user', content: message }
        ];

        // Save user message to database
        await Chat.addMessage({
            userId,
            conversationId,
            message,
            role: 'user'
        });

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: formattedMessages,
            max_tokens: 500,
            temperature: 0.7,
        });

        // Extract the response
        const aiResponse = completion.choices[0].message;

        // Save assistant response to database
        await Chat.addMessage({
            userId,
            conversationId,
            message: aiResponse.content,
            role: aiResponse.role
        });

        // Return the response
        return res.status(200).json({
            success: true,
            data: {
                message: aiResponse.content,
                role: aiResponse.role
            }
        });
    } catch (error) {
        next(error);
    }
};


// const personalityCheck = async (req, res, next) => {
//     const { userId } = req.user;
//     const userDB = await User.findById(userId);
//     if (!userDB) {
//         return res.status(404).json({
//             success: false,
//             message: 'User not found'
//         });
//     }
    
// }

module.exports = {
    createConversation,
    getConversations,
    getMessages,
    deleteConversation,
    sendMessage
};