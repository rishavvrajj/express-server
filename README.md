# Express TypeScript API Server

A production-ready Express.js REST API built with TypeScript, PostgreSQL, and modern development practices.

## Features

- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **Express.js 5** - Fast, minimalist web framework
- ✅ **PostgreSQL** - Robust relational database with connection pooling
- ✅ **Database Migrations** - SQL-based migration system with transaction support
- ✅ **Logging** - Structured logging with Pino (pretty-printed in development)
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **CORS** - Cross-Origin Resource Sharing enabled
- ✅ **Environment Configuration** - Secure environment variable management
- ✅ **Hot Reload** - Development server with auto-restart on file changes

## Project Structure

```
express/
├── src/
│   ├── configs/
│   │   └── env.ts              # Environment configuration
│   ├── libs/
│   │   ├── db.ts               # Database connection pool
│   │   └── logger.ts           # Logger configuration
│   ├── middlewares/
│   │   ├── errorHandler.ts     # Global error handler
│   │   └── notFound.ts         # 404 handler
│   ├── routes/
│   │   └── health.routes.ts    # Health check endpoint
│   ├── scripts/
│   │   └── migrate.ts          # Database migration script
│   ├── app.ts                  # Express app setup
│   ├── index.ts                # API router setup
│   └── server.ts               # Server entry point
├── migrations/
│   ├── 001_pgcrypto.sql        # UUID extension
│   ├── 002_users_table.sql     # Users table
│   ├── 003_tasks_tables.sql    # Support tasks table
│   └── 004_banner_table.sql    # Banners table
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment template
├── .gitignore
├── docker-compose.yml          # PostgreSQL container
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** 12 or higher
- **npm** or **yarn**

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd express
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
PORT=4000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/mydb
```

### 4. Set up PostgreSQL

**Option A: Using Docker (Recommended)**

```bash
npm run docker:up
```

**Option B: Using local PostgreSQL**

Make sure PostgreSQL is running, then create the database:

```bash
# Using psql
psql -U postgres -h localhost

# In psql prompt
CREATE DATABASE mydb;
\q
```

### 5. Run database migrations

```bash
npm run migrate
```

This will create all necessary tables:
- `migrations` - Tracks applied migrations
- `users` - User accounts with Google OAuth support
- `support_task` - Support ticket system
- `banners` - Banner management

### 6. Start the development server

```bash
npm run dev
```

The server will start at `http://localhost:4000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run migrate` | Run database migrations |
| `npm run docker:up` | Start PostgreSQL in Docker |
| `npm run docker:down` | Stop PostgreSQL container |

## API Endpoints

### Health Check

**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,
  google_id VARCHAR(255) UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Support Tasks Table

```sql
CREATE TABLE support_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN' 
    CHECK (status IN ('OPEN','IN_PROGRESS', 'RESOLVED')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Banners Table

```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Migration System

The project uses a simple SQL-based migration system:

1. Migrations are stored in the `migrations/` directory
2. Each migration is a `.sql` file with a numeric prefix (e.g., `001_name.sql`)
3. Migrations run in alphabetical order
4. Each migration runs in a transaction (rollback on error)
5. Applied migrations are tracked in the `migrations` table

### Creating a New Migration

1. Create a new file in `migrations/` with the next number:
   ```bash
   # Example: 005_add_comments.sql
   ```

2. Write your SQL:
   ```sql
   CREATE TABLE comments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     content TEXT NOT NULL,
     user_id UUID NOT NULL REFERENCES users(id),
     created_at TIMESTAMP NOT NULL DEFAULT NOW()
   );
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `LOG_LEVEL` | Log level (debug/info/warn/error) | `info` |
| `DATABASE_URL` | PostgreSQL connection string | *Required* |

## Logging

The application uses [Pino](https://getpino.io/) for structured logging:

- **Development**: Pretty-printed, colorized logs
- **Production**: JSON-formatted logs for log aggregation

Example log output:

```
[2026-11-03 19:36:35] INFO: Server is running on http://localhost:4000
[2026-11-03 19:36:42] INFO: Migration completed: 001_pgcrypto.sql
```

## Error Handling

The application includes centralized error handling:

- **Global Error Handler**: Catches unhandled errors and returns 500 responses
- **404 Handler**: Returns a JSON response for undefined routes
- **Database Errors**: Logged with full error details

## Production Deployment

### 1. Build the application

```bash
npm run build
```

### 2. Set production environment variables

```env
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_URL=postgresql://user:pass@prod-host:5432/dbname
```

### 3. Run migrations

```bash
npm run migrate
```

### 4. Start the server

```bash
npm start
```

## Docker Support

A `docker-compose.yml` is included for local PostgreSQL:

```yaml
services:
  postgres:
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

## TypeScript Configuration

The project uses strict TypeScript settings:

- **Target**: ES2022
- **Module**: NodeNext (ESM-ready)
- **Strict Mode**: Enabled
- **Source Maps**: Generated for debugging

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests if applicable
4. Ensure TypeScript compiles without errors: `npm run build`
5. Submit a pull request

## Common Issues

### Migration fails with "password authentication failed"

- Check your PostgreSQL password in `.env`
- Ensure PostgreSQL is running
- Verify the connection string format

### Database connection timeout

- Check if PostgreSQL is running: `npm run docker:up`
- Verify the database exists
- Check firewall settings

### Port already in use

- Change the `PORT` in `.env`
- Or stop the process using port 4000

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.
