# Prisma Migrations

This directory contains all database migrations managed by Prisma.

## Running Migrations

### Development (with Database Push)
```bash
npm run db:push
```

This command will push your schema changes directly to the database. Use this during development.

### Production (with Migrations)
When you're ready for production:

```bash
# Create a new migration based on schema changes
npx prisma migrate dev --name <migration_name>

# Apply migrations to production database
npx prisma migrate deploy
```

## Migration Workflow

1. **Make schema changes** in `prisma/schema.prisma`

2. **Create a migration** (for production):
   ```bash
   npx prisma migrate dev --name descriptive_name
   # Example: npx prisma migrate dev --name add_testimonials_table
   ```

3. **Test locally** - the migration will be applied to your dev database

4. **Review the generated SQL** in the migration folder

5. **Deploy to production**:
   ```bash
   npx prisma migrate deploy
   ```

## Important Notes

- Each migration is a single transaction
- Migrations are applied in order by timestamp
- Don't manually edit migration files unless you know what you're doing
- Always test migrations in a development environment first
- Keep migrations versioned in your repository

## Reset Database (Development Only)
```bash
npx prisma migrate reset
```

This will:
1. Drop the current database
2. Create a new database
3. Apply all migrations
4. Run the seed script

## Common Commands

- View migration history: `npx prisma migrate status`
- Generate types: `npx prisma generate`
- Open Prisma Studio: `npm run db:studio`
- Seed database: `npm run db:seed`
