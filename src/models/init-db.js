const fs = require('fs');
const path = require('path');
const db = require('../configs/db');

async function initializeDatabase() {
    try {
        // Read the schema SQL file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the SQL commands
        await db.query(schema);
        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Error initializing database schema:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;