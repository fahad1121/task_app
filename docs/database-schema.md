# Database Schema — IQT-FSD-2026

## 1. Overview

The application uses MySQL to persist task records. Laravel Eloquent ORM manages database operations, and Laravel migrations define the schema.

**Database table:** `tasks`

## 2. Table Definition

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | Primary key, auto-increment | Unique task identifier |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `description` | TEXT | NULL allowed | Optional task description |
| `completed` | BOOLEAN | NOT NULL, default FALSE | Indicates whether the task is completed |
| `created_at` | TIMESTAMP | NULL allowed | Record creation timestamp |
| `updated_at` | TIMESTAMP | NULL allowed | Last modification timestamp |

The exact physical types and nullability should be verified against the Laravel migration in `backend/database/migrations/`.

## 3. Relationships

The `tasks` table has no foreign-key relationships in the current implementation. Each task is an independent record.

## 4. Data Validation

Laravel validates incoming API requests before creating or updating tasks.

- `title`: Required when creating a task; must be a string with a maximum length of 255 characters.
- `description`: Optional; must be a string when provided.
- `completed`: Optional; must be a boolean when provided.
- Updates accept individual fields, allowing completion status to be changed without resubmitting the entire task.

## 5. Data Access

The Laravel `App\Models\Task` Eloquent model provides access to task records.

The REST API supports:

- Retrieving all tasks
- Creating a task
- Retrieving a task by ID
- Updating a task
- Deleting a task

## 6. Migrations

The schema is defined in the Laravel migration that creates the `tasks` table. To apply migrations in the local Sail environment:

```bash
./vendor/bin/sail artisan migrate
```

## 7. Assessment Identifier

`IQT-FSD-2026`
