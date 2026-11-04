# express-server

A TypeScript-based Express.js REST API with PostgreSQL, JWT auth, and a SQL migration system.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Start PostgreSQL (Docker)
npm run docker:up

# Run migrations
npm run migrate

# Start development server
npm run dev
```

Server runs at `http://localhost:4000`

## Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run migrate` - Run database migrations
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container

## Environment Variables

```env
PORT=4000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=30m
```

## Project Structure

```
src/
├── configs/        # Environment configuration
├── constants/      # App constants
├── errors/         # Custom error classes
├── libs/           # Database, logger, JWT
├── middlewares/    # Auth, admin, error handling
├── repositories/   # Database queries
├── routes/         # API endpoints
├── services/       # Business logic
├── scripts/        # Migration tool
├── types/          # TypeScript types
└── server.ts       # Entry point

migrations/         # SQL migration files
```

## API Endpoints

| Method | Path                  | Auth | Description          |
|--------|-----------------------|------|----------------------|
| GET    | `/api/health`         | No   | Health check         |
| POST   | `/api/auth/register`  | No   | Register a new user  |
| POST   | `/api/auth/login`     | No   | Login, returns JWT   |
| GET    | `/api/auth/user`      | Yes  | Get current user     |

Authenticated routes require a `Authorization: Bearer <token>` header.

## Database Migrations

Migrations are SQL files in `migrations/`, run sequentially:

```bash
npm run migrate
```

Create new migrations with a numeric prefix:

```
migrations/005_your_migration.sql
```

## Tech Stack

- Express.js 5
- TypeScript
- PostgreSQL (pg)
- JWT (jsonwebtoken)
- bcrypt
- Pino (logging)
