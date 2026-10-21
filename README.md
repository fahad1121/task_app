# IQT-FSD-2026 — Full Stack Developer Assessment

A full-stack Task Manager application built with Laravel REST APIs, Next.js, and MySQL. The project also includes a GitHub Repository Explorer that integrates with the public GitHub REST API.

## Features

### Task Manager
- View all tasks.
- Create tasks with a title and optional description.
- Edit existing tasks.
- Mark tasks as completed or incomplete.
- Delete tasks.
- Store task data persistently in MySQL.
- Validate incoming requests through Laravel.
- Display loading states and API error messages in the frontend.

### GitHub Repository Explorer
- Search public GitHub repositories by username.
- Display up to six recently updated repositories.
- Show repository names and descriptions.
- Display programming languages, star counts, and fork counts.
- Open repositories on GitHub.
- Handle invalid usernames and API errors.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| UI | Bootstrap 5 |
| Backend | Laravel REST API |
| Database | MySQL |
| Containerization | Docker, Laravel Sail |
| External API | GitHub REST API |
| Testing | Laravel feature tests |
| Version control | Git, GitHub |

## Project Structure

```text
iqt-fsd-2026/
├── backend/                  # Laravel application
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   │   └── Feature/
│   ├── compose.yaml           # If present in your project
│   └── .env
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx           # Task Manager
│   │   ├── github/
│   │   │   └── page.tsx       # GitHub Repository Explorer
│   │   └── layout.tsx
│   ├── lib/
│   │   └── tasks.ts
│   └── .env.local
├── docs/
│   ├── database-schema.md
│   └── github-api-integration.png
└── README.md
```

The `docs` files should be added as part of the submission. Adjust this structure if your actual files are located elsewhere.

## Prerequisites

Install or have access to:

- Docker and Docker Compose
- PHP and Composer for dependency installation, if needed
- Node.js and npm
- Git

Laravel Sail runs the Laravel application and its configured services inside Docker containers.

## Local Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd iqt-fsd-2026
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 2. Configure the Laravel backend

Navigate to the backend:

```bash
cd backend
```

If dependencies have not been installed:

```bash
composer install
```

Create the environment file if it does not exist:

```bash
cp .env.example .env
```

Configure the database connection in `backend/.env` to match your Laravel Sail MySQL service. For a standard Sail configuration, the database host is usually the MySQL service name and the port is `3306` inside Docker.

Generate the application key:

```bash
./vendor/bin/sail artisan key:generate
```

Start the configured Sail services:

```bash
./vendor/bin/sail up -d
```

Run the database migrations:

```bash
./vendor/bin/sail artisan migrate
```

The Laravel API is expected to be available at:

`http://localhost`

Confirm the actual host port in your Sail Compose configuration if this URL does not work.

### 3. Configure the Next.js frontend

Open a separate terminal from the project root:

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost/api
```

This variable tells the browser-side frontend where to send requests to the Laravel API.

Start the development server:

```bash
npm run dev
```

Open the application:

- Task Manager: http://localhost:3000
- GitHub Repository Explorer: http://localhost:3000/github

Keep the Laravel Sail services running while using the frontend.

## REST API Endpoints

The Laravel API provides the following task endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/{id}` | Retrieve a specific task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

### Create task example

Request:

```http
POST /api/tasks
Content-Type: application/json
Accept: application/json
```

```json
{
  "title": "Complete assessment",
  "description": "Finish the Full Stack Developer assessment",
  "completed": false
}
```

The API validates the request and returns the created task with HTTP status `201 Created`.

### Update task example

```http
PUT /api/tasks/1
Content-Type: application/json
Accept: application/json
```

```json
{
  "completed": true
}
```

The API returns the updated task.

### Delete task example

```http
DELETE /api/tasks/1
Accept: application/json
```

A successful deletion returns HTTP status `204 No Content`.

## Database Schema

The application uses a MySQL table named `tasks`.

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT, primary key | Unique task identifier |
| `title` | VARCHAR(255) | Task title |
| `description` | TEXT, nullable | Optional task description |
| `completed` | BOOLEAN, default false | Task completion status |
| `created_at` | TIMESTAMP, nullable | Record creation timestamp |
| `updated_at` | TIMESTAMP, nullable | Last update timestamp |

The schema is managed through Laravel database migrations.

See [`docs/database-schema.md`](docs/database-schema.md) for the detailed schema documentation.

## GitHub API Integration

The GitHub Repository Explorer uses the public GitHub REST API.

**Endpoint:**

```text
GET https://api.github.com/users/{username}/repos?sort=updated&per_page=6
```

The frontend displays repository names, descriptions, programming languages, star counts, and fork counts.

Basic public repository lookups do not require an API token. Unauthenticated requests are subject to GitHub's rate limits.

**Integration evidence:** See [`docs/github-api-integration.png`](docs/github-api-integration.png) for the screenshot of the working integration.

API documentation: https://docs.github.com/en/rest

## Automated Tests

Laravel feature tests cover:

- Listing tasks.
- Creating tasks.
- Validating required task titles.
- Updating tasks.
- Deleting tasks.

Run the tests from the backend directory:

```bash
./vendor/bin/sail artisan test
```

To run only the task API tests:

```bash
./vendor/bin/sail artisan test --filter=TaskApiTest
```

Tests should use a dedicated testing database so that test migrations and database resets do not affect development data.

## Environment Configuration

Environment-specific settings belong in `.env` and `.env.local` files.

Do not commit:

- Database passwords
- Application secrets
- API tokens
- Local environment files containing credentials

Keep `.env.example` files updated with safe placeholder values where appropriate.

## Assessment Identifier

**IQT-FSD-2026**

This identifier is used for the Full Stack Developer assessment.

## Deployment

The application is currently configured for local development.

**Live demo:** Not yet deployed.

A live demo URL can be added here after the application has been deployed and verified.

## Future Improvements

Potential improvements include:

- User authentication and task ownership.
- Pagination and filtering.
- More automated frontend tests.
- CI/CD and production deployment.
- Enhanced accessibility and responsive UI refinements.
