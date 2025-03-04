const db = require('../configs/db');
const bcrypt = require('bcrypt');

/**
 * User model for database operations
 */
const User = {
    /**
     * Create a new user
     * @param {Object} userData - User data (username, email, password)
     * @returns {Promise<Object>} - Created user object (without password)
     */
    async create(userData) {
        const { username, email, password } = userData;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
    `;

        const result = await db.query(query, [username, email, hashedPassword]);
        return result.rows[0];
    },

    /**
     * Find a user by username
     * @param {string} username - Username to search for
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        return result.rows[0] || null;
    },

    /**
     * Find a user by email
     * @param {string} email - Email to search for
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0] || null;
    },

    /**
     * Find a user by ID
     * @param {number} id - User ID to search for
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async findById(id) {
        const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Verify a password against a hashed password
     * @param {string} password - Plain text password
     * @param {string} hashedPassword - Hashed password from database
     * @returns {Promise<boolean>} - True if password matches
     */
    async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
};

module.exports = User;