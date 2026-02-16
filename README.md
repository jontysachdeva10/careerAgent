# CareerAgent

CareerAgent is an AI-powered career strategy assistant that helps users analyze their experience, skills, and goals to provide practical career advice, skill gap analysis, and personalized roadmaps.

---

## Features

- User authentication with JWT
- AI-driven chat for career guidance (powered by Groq LLM)
- Automatic extraction and updating of user career profiles from chat
- Profile management (roles, skills, goals, interests, etc.)
- Secure API endpoints with Express and Prisma ORM
- PostgreSQL database schema with migrations
- Delete chat history and user data

---

## Architecture & Data Flow

### Overview

```
[Client] 
   |
   v
[Express API Routes]
   |
   v
[Middleware: Auth] --(JWT)--> [User Info]
   |
   v
[Controllers] --(Request)--> [Services]
   |
   v
[Services] <--> [Prisma ORM] <--> [PostgreSQL DB]
   |
   v
[Groq Service] <--> [Groq LLM API]
```

### Service Responsibilities

- **auth.route.ts**: Handles user login and JWT issuance.
- **chat.route.ts**: Receives chat messages, returns AI replies.
- **delete.route.ts**: Handles chat deletion requests.
- **chat.service.ts**: Orchestrates chat logic, history, AI calls, and profile updates.
- **profile.service.ts**: Extracts structured profile data from chat using AI.
- **groq.service.ts**: Handles communication with Groq LLM API.
- **deleteMessage.service.ts**: Deletes (soft or hard) user messages and data.
- **mergeProfile.ts**: Merges new and existing profile data.
- **prisma.ts**: Exposes the Prisma client for DB access.
- **middleware/auth.ts**: JWT authentication middleware.

### Data Flow Example

1. **User logs in**  
   - `/auth/login` issues a JWT after upserting the user.

2. **User sends a chat message**  
   - `/api/chat` (with JWT) triggers:
     - User/message upsert
     - Conversation history retrieval
     - Profile context building
     - Groq LLM call for reply
     - Assistant reply saved
     - Profile extraction and update

3. **User deletes chat**  
   - `/delete/chat` marks all user messages as deleted.

---

## Folder Structure

```
src/
  app.ts                # Express app setup
  server.ts             # Server entry point
  prisma.ts             # Prisma client instance
  controllers/          # (Controllers for route logic)
  middleware/           # Authentication middleware
  prompts/              # AI prompt templates
  routes/               # Express route handlers
  services/             # Business logic and integrations
  types/                # TypeScript types/interfaces
  utils/                # Utility functions
prisma/
  schema.prisma         # Prisma database schema
  migrations/           # Database migrations
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Yarn or npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/jontysachdeva10/careerAgent.git
   cd careerAgent
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   PORT=4000
   ```

4. Run database migrations:
   ```
   npx prisma migrate deploy
   ```

5. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

---

## API Endpoints

### Auth

- `POST /auth/login`  
  Request: `{ "email": "user@example.com" }`  
  Response: `{ "token": "..." }`

### Chat

- `POST /api/chat`  
  Headers: `Authorization: Bearer <token>`  
  Request: `{ "message": "I want to become a product manager..." }`  
  Response: `{ "reply": "..." }`

### Delete

- `DELETE /delete/chat`  
  Headers: `Authorization: Bearer <token>`  
  Response: `{ "success": true }`

---

## Scripts

- `npm run dev` — Start the server in development mode
- `npx prisma migrate deploy` — Apply database migrations

---

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for JWT signing
- `GROQ_API_KEY` — API key for Groq LLM
- `PORT` — Server port (default: 4000)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## License

This project is licensed under the ISC License.

---

## Acknowledgements

- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Groq LLM](https://groq.com/)