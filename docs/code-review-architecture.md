# IQT-FSD-2026 — Code Review & Architecture

## 1. What steps would you take to secure a web application?

I would secure a web application using a layered approach.

First, I would implement secure authentication and server-side authorization, following the principle of least privilege. Every protected resource should be checked to ensure users can access only the data and actions they are permitted to use.

I would validate all incoming data on the backend, use Laravel's Eloquent ORM or parameterized queries to prevent SQL injection, and apply proper output encoding to mitigate cross-site scripting (XSS). I would also implement CSRF protection where applicable, HTTPS, secure cookies, appropriate security headers, and rate limiting for sensitive endpoints.

Secrets such as database credentials and API tokens should be stored in environment variables or a secrets manager and never committed to Git. CORS should allow only trusted origins.

Finally, I would keep dependencies updated, log security-relevant events without exposing sensitive information, back up important data, and include automated tests and security checks in the development workflow.

## 2. How would you improve the performance of a slow React application?

I would start by profiling the application with React Developer Tools and browser performance tools to identify the actual bottlenecks.

I would reduce unnecessary component renders by improving component structure and using `React.memo`, `useMemo`, or `useCallback` when profiling demonstrates a benefit. I would use dynamic imports and code splitting to reduce initial JavaScript bundle size.

For large datasets, I would implement pagination or list virtualization. I would also reduce unnecessary network requests, debounce frequent search input, cache reusable API responses, and optimize images and other static assets.

In Next.js, I would consider server rendering or static generation where appropriate. I would measure loading time, rendering performance, and responsiveness after each change to verify the improvements.

## 3. Explain the difference between SQL and NoSQL databases and when you would use each.

SQL databases, such as MySQL and PostgreSQL, store data in relational tables with defined schemas. They support relationships, joins, constraints, and transactions, making them suitable for applications that require structured data and reliable data integrity.

NoSQL databases, such as MongoDB and Redis, support data models including documents and key-value structures. They can be useful for flexible document data, caching, and workloads with specific scalability or access-pattern requirements.

I would choose SQL for business applications such as task management systems where structured records, validation, relationships, and transactions are important. I would consider NoSQL when its data model and operational characteristics better fit the application's requirements.

The decision should depend on data structure, query patterns, consistency needs, scale, and maintenance requirements rather than assuming one type is always faster.

## 4. How would you deploy a full-stack application to AWS, Azure, or Google Cloud?

I would deploy the frontend, backend API, and database as separate components with secure communication between them.

For example, on AWS, I could host the Next.js frontend on a suitable managed hosting platform, deploy Laravel in containers using Amazon ECS with Fargate, and use Amazon RDS for MySQL.

I would configure environment variables and secrets through a secrets manager, enable HTTPS, restrict network access, and apply least-privilege IAM permissions. Database migrations would run as a controlled deployment step, with backups and a recovery plan in place.

I would establish CI/CD to run automated tests, build the application, and deploy approved changes. Monitoring, application logs, health checks, and alerts would help identify issues. Before release, I would verify frontend behavior, API endpoints, database persistence, and rollback procedures.
