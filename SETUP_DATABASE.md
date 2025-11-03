# Database Setup Guide

This guide will help you set up the PostgreSQL database for NodeFlow.

## Prerequisites

- PostgreSQL installed on your system
- Node.js and npm installed

## Steps

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nodeflow;

# Create user (optional)
CREATE USER nodeflow_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nodeflow TO nodeflow_user;

# Exit
\q
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nodeflow?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_ID=""
GITHUB_SECRET=""
```

To generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 4. View Database (Optional)

```bash
# Open Prisma Studio to view/edit data
npx prisma studio
```

## Database Schema

### Tables Created:

1. **User** - User accounts with authentication
2. **Account** - OAuth accounts linked to users
3. **Session** - User sessions
4. **VerificationToken** - Email verification tokens
5. **Workflow** - User workflows
6. **Node** - Workflow nodes
7. **Edge** - Workflow edges/connections

## Common Commands

```bash
# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Generate Prisma Client after schema changes
npx prisma generate

# Create a migration
npx prisma migrate dev --name your_migration_name

# View database in browser
npx prisma studio
```

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:

1. Check if PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status

   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verify your DATABASE_URL in `.env`

3. Check PostgreSQL logs for errors

### Permission Issues

If you get permission errors:

```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE nodeflow TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

## Production Deployment

For production, use a managed PostgreSQL service:

- **Vercel** → Vercel Postgres
- **Railway** → Railway PostgreSQL
- **Supabase** → Supabase PostgreSQL
- **AWS** → RDS PostgreSQL
- **Digital Ocean** → Managed PostgreSQL

Update your `DATABASE_URL` environment variable with the production connection string.
