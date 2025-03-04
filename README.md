# Personal Chat Backend

A simple chat web backend that connects to OpenAI's API with JWT authentication and password hashing.

## Features

- User authentication with JWT tokens
- Password hashing with bcrypt
- OpenAI integration for chat functionality
- PostgreSQL database for storing users and chat history
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=postgres://username:password@localhost:5432/personal_chat
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
4. Initialize the database:
   ```
   node src/models/init-db.js
   ```
5. Start the server:
   ```
   npm start
   ```
   
## API Endpoints

### Authentication

#### Register a new user
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2023-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2023-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Get user profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### Chat

#### Create a new conversation
- **URL**: `/api/chat/conversations`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Body**:
  ```json
  {
    "title": "My Conversation"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "conversation": {
        "id": 1,
        "user_id": 1,
        "title": "My Conversation",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### Get all conversations
- **URL**: `/api/chat/conversations`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "conversations": [
        {
          "id": 1,
          "user_id": 1,
          "title": "My Conversation",
          "created_at": "2023-01-01T00:00:00.000Z",
          "updated_at": "2023-01-01T00:00:00.000Z",
          "message_count": "5"
        }
      ]
    }
  }
  ```

#### Get messages for a conversation
- **URL**: `/api/chat/conversations/:conversationId/messages`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "messages": [
        {
          "id": 1,
          "user_id": 1,
          "conversation_id": 1,
          "message": "Hello",
          "role": "user",
          "created_at": "2023-01-01T00:00:00.000Z"
        },
        {
          "id": 2,
          "user_id": 1,
          "conversation_id": 1,
          "message": "Hi there! How can I help you today?",
          "role": "assistant",
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ]
    }
  }
  ```

#### Delete a conversation
- **URL**: `/api/chat/conversations/:conversationId`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Conversation deleted successfully"
  }
  ```

#### Send a message
- **URL**: `/api/chat/send`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Body**:
  ```json
  {
    "message": "Hello, how are you?",
    "conversationId": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "message": "I'm doing well, thank you for asking! How can I assist you today?",
      "role": "assistant"
    }
  }
  ```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security

- Passwords are hashed using bcrypt
- Authentication is handled with JWT tokens
- API endpoints are protected with authentication middleware