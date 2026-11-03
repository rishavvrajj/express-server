# express-server

A TypeScript-based Express.js REST API with PostgreSQL.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

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
```

## Project Structure

```
src/
├── configs/        # Environment configuration
├── libs/           # Database & logger
├── middlewares/    # Error handling
├── routes/         # API endpoints
├── scripts/        # Migration tool
└── server.ts       # Entry point

migrations/         # SQL migration files
```

## Database Migrations

Migrations are SQL files in `migrations/` directory, run sequentially:

```bash
npm run migrate
```

Create new migrations with numeric prefix:
```
migrations/005_your_migration.sql
```
