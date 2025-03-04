const db = require('../configs/db');

/**
 * Chat model for database operations
 */
const Chat = {
    /**
     * Create a new conversation
     * @param {number} userId - User ID
     * @param {string} title - Conversation title
     * @returns {Promise<Object>} - Created conversation object
     */
    async createConversation(userId, title = 'New Conversation') {
        const query = `
        INSERT INTO conversations (user_id, title)
        VALUES ($1, $2)
        RETURNING *
    `;

        const result = await db.query(query, [userId, title]);
        return result.rows[0];
    },

    /**
     * Get all conversations for a user
     * @param {number} userId - User ID
     * @returns {Promise<Array>} - Array of conversation objects
     */
    async getConversations(userId) {
        const query = `
        SELECT c.*, 
            (SELECT COUNT(*) FROM chat_history ch WHERE ch.conversation_id = c.id) as message_count
        FROM conversations c
        WHERE c.user_id = $1
        ORDER BY c.updated_at DESC
    `;

        const result = await db.query(query, [userId]);
        return result.rows;
    },

    /**
     * Add a message to chat history
     * @param {Object} messageData - Message data
     * @param {number} messageData.userId - User ID
     * @param {number} messageData.conversationId - Conversation ID
     * @param {string} messageData.message - Message content
     * @param {string} messageData.role - Message role (user, assistant, system)
     * @returns {Promise<Object>} - Created message object
     */
    async addMessage({ userId, conversationId, message, role }) {
        const query = `
        INSERT INTO chat_history (user_id, conversation_id, message, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

        const result = await db.query(query, [userId, conversationId, message, role]);

        // Update the conversation's updated_at timestamp
        await db.query(
            'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
            [conversationId]
        );

        return result.rows[0];
    },

    /**
     * Get all messages for a conversation
     * @param {number} conversationId - Conversation ID
     * @param {number} userId - User ID (for security)
     * @returns {Promise<Array>} - Array of message objects
     */
    async getMessages(conversationId, userId) {
        const query = `
        SELECT ch.*
        FROM chat_history ch
        JOIN conversations c ON ch.conversation_id = c.id
        WHERE ch.conversation_id = $1 AND c.user_id = $2
        ORDER BY ch.created_at ASC
    `;

        const result = await db.query(query, [conversationId, userId]);
        return result.rows;
    },

    /**
     * Delete a conversation and all its messages
     * @param {number} conversationId - Conversation ID
     * @param {number} userId - User ID (for security)
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    async deleteConversation(conversationId, userId) {
        // First check if the conversation belongs to the user
        const checkQuery = 'SELECT id FROM conversations WHERE id = $1 AND user_id = $2';
        const checkResult = await db.query(checkQuery, [conversationId, userId]);

        if (checkResult.rows.length === 0) {
            return false;
        }

        // Delete the conversation (cascade will delete messages)
        const query = 'DELETE FROM conversations WHERE id = $1 AND user_id = $2';
        await db.query(query, [conversationId, userId]);

        return true;
    }
};

module.exports = Chat;