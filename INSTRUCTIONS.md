# BookingPage

Full-stack web application for event management and electronic ticket reservations.

BookingPage is an event booking platform where visitors can browse events, participants can reserve tickets, organizers can manage events and ticket types, and administrators can manage users and export platform data.

> Current status: active development / prototype. The repository already contains a Spring Boot backend, a React frontend, draft documentation, database entities, seed data, and basic REST endpoints. Authentication and authorization still need production hardening before deployment.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start for Ubuntu / WSL](#quick-start-for-ubuntu--wsl)
- [Local Setup](#local-setup)
- [Running the App](#running-the-app)
- [Database](#database)
- [API Overview](#api-overview)
- [Frontend Routes](#frontend-routes)
- [Roles and Flows](#roles-and-flows)
- [Development Notes](#development-notes)
- [Security / Production Notes](#security--production-notes)
- [Useful Commands](#useful-commands)
- [Documentation](#documentation)

## Features

### Implemented / partially implemented

- React frontend with pages for:
  - welcome
  - login
  - registration
  - home
  - event browsing
  - event details
  - booking screen
  - messaging screen
  - users list
  - user details
- Spring Boot REST backend.
- PostgreSQL persistence through Spring Data JPA.
- Entities for:
  - users
  - events
  - ticket types
  - bookings
- Basic endpoints for:
  - login/register
  - users
  - events
  - ticket types
  - backend health/test response
- Mock SQL data for local development.
- Draft documentation for requirements, roles, pages, database schema, booking logic, and service logic.

### Planned / documented

- Admin approval for newly registered users.
- Organizer event management workflow.
- Booking creation and cancellation service.
- Messaging inbox/sent/unread flow.
- XML/JSON export for administrators.
- Recommendation system based on booking history and viewed events.
- Production-ready authentication and authorization.

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Spring Validation
- PostgreSQL
- Maven wrapper

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- ESLint

## Project Structure

```text
.
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/eventPlatform/backend/
│       │   │   ├── controller/
│       │   │   ├── entity/
│       │   │   ├── enums/
│       │   │   ├── repository/
│       │   │   ├── service/
│       │   │   ├── Util/
│       │   │   ├── BackendApplication.java
│       │   │   └── CorsConfig.java
│       │   └── resources/
│       │       ├── application.properties
│       │       └── data.sql
│       └── test/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── Auth/
│       ├── components/
│       ├── pages/
│       ├── App.tsx
│       └── main.tsx
├── docs/
│   ├── bookingLogic.md
│   ├── databaseSchema.md
│   ├── entitiesDraft.md
│   ├── pagesMap.md
│   ├── requirementsBreakdown.md
│   ├── rolesAndFlows.md
│   └── servicesLogic.md
├── scripts/
│   └── reset-data.sql
└── auth-production-readiness-steps.md
```

## Prerequisites

Install these before running the app locally:

- Java 17
- Node.js 20.19+ (Node 20; pinned by `.nvmrc`)
- npm
- PostgreSQL
- Git

The backend currently expects a local PostgreSQL database using the values in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/my-postgres
spring.datasource.username=postgres
spring.datasource.password=postgres
```

If PostgreSQL is running on a different port, update
`spring.datasource.url` and use the same port in the commands below.

## Quick Start for Ubuntu / WSL

This section is the fastest path for running the project inside Ubuntu or WSL.

It is split into three parts:

1. database
2. backend
3. frontend

### 1. Base setup

Update packages and install the required tools:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk postgresql postgresql-contrib nodejs npm git curl
```

Check versions:

```bash
java -version
node -v
npm -v
psql --version
```

Java should be version 17. Node.js 20+ is recommended for the frontend. If the Ubuntu package gives you an older Node.js version, install Node.js through `nvm` or NodeSource before running the frontend.

### 2. Database

Start PostgreSQL:

```bash
sudo service postgresql start
```

Open the PostgreSQL shell as the `postgres` user:

```bash
sudo -u postgres psql
```

Inside `psql`, create the database and set the password expected by the backend:

```sql
ALTER USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE "my-postgres";
\q
```

The backend config currently expects:

```text
database: my-postgres
username: postgres
password: postgres
host: localhost
port: 5433
```

### 3. Backend

From the project root:

```bash
cd backend
chmod +x mvnw
./mvnw spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

Test it from another terminal:

```bash
curl http://localhost:8080/api/test
```

Expected response:

```text
Backend works!
```

Hibernate creates or updates the tables, and Spring Boot then loads the
development records from `backend/src/main/resources/data.sql`. No separate
seed command is required.

The demo accounts all use the password `password123`:

| Role | Email |
| --- | --- |
| Admin | `admin@example.com` |
| Organizer | `organizer@example.com` |
| Participant | `nikos@example.com` |
| Participant | `maria@example.com` |

### 4. Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start on:

```text
http://localhost:5173
```

Open that URL in your browser.

### 5. Normal WSL startup after first setup

After the first setup, the usual workflow is:

Terminal 1:

```bash
sudo service postgresql start
cd backend
./mvnw spring-boot:run
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd BookingPage-main
```

If you are already inside this workspace, the root folder is:

```text
E:\Software\BookingPage-main\BookingPage-main
```

### 2. Create the PostgreSQL database

Create a database named:

```text
my-postgres
```

Using `psql`, for example:

```bash
createdb -U postgres my-postgres
```

Or create it manually from pgAdmin.

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Let the backend create tables

Start the backend once. Hibernate is configured with:

```properties
spring.jpa.hibernate.ddl-auto=update
```

That means tables are created/updated automatically from the JPA entities during local development.

### 5. Development data

The backend automatically loads:

```text
backend/src/main/resources/data.sql
```

The script adds demo users, events, ticket types, and bookings. Its inserts use
fixed primary keys with `ON CONFLICT DO NOTHING`, so restarting the backend
does not duplicate or overwrite existing records.

All demo accounts use the password:

```text
password123
```

### 6. Reset development data

Resetting is manual and destructive. Run the reset only against the local
`my-postgres` development database.

If the database was previously loaded from the old `mock-data.sql`, run this
reset once so the old rows are replaced with the corrected relationships and
BCrypt password hashes.

From WSL:

```bash
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -d my-postgres -f scripts/reset-data.sql
```

From Windows PowerShell:

```powershell
$env:PGPASSWORD='postgres'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -p 5433 -U postgres -d my-postgres -f scripts\reset-data.sql
```

Adjust the PostgreSQL executable path or port if necessary. After the reset,
restart the backend; Spring Boot will load `data.sql` again with fresh
relative event dates.

## Running the App

### Backend

From the repository root:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

Quick test:

```text
GET http://localhost:8080/api/test
```

Expected response:

```text
Backend works!
```

### Frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The backend CORS config currently allows this Vite dev origin.

## Database

The implemented JPA entities are:

### User

Represents registered platform users.

Important fields:

- `id`
- `firstName`
- `lastName`
- `email`
- `password`
- `phoneNumber`
- `address`
- `tin`
- `role`

### Event

Represents an event created by an organizer.

Important fields include event title, category, venue, location, date/time, capacity, status, organizer, bookings, and ticket types.

### TicketType

Represents a ticket category for an event.

Important fields:

- `name`
- `price`
- `quantity`
- `available`
- `event`

### Booking

Represents a ticket reservation.

Important fields:

- `time`
- `numberOfTickets`
- `totalCost`
- `bookingStatus`
- `attendee`
- `ticketType`
- `event`

## API Overview

### Auth

Base path:

```text
/api/auth
```

Current endpoints:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Attempts login |
| `POST` | `/api/auth/register` | Registers a user |

### Users

Base path:

```text
/api/users
```

Current endpoints:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/users` | Returns all users |
| `GET` | `/api/users/{id}` | Returns a user by id |
| `POST` | `/api/users` | Creates a user |
| `PUT` | `/api/users` | Replaces/saves a user |
| `PATCH` | `/api/users` | Partially updates a user |

### Events

Base path:

```text
/api/events
```

Current endpoints:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/events` | Returns all events |
| `GET` | `/api/events/{id}` | Returns an event by id |
| `POST` | `/api/events` | Creates an event |
| `DELETE` | `/api/events/{id}` | Deletes an event |

### Ticket Types

Base path:

```text
/api/tickets
```

Current endpoint:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/tickets/event/{eventId}` | Adds a ticket type to an event |

### Test

Base path:

```text
/api/test
```

Current endpoint:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/test` | Simple backend health/test response |

## Frontend Routes

The current React app defines these routes:

| Path | Page |
| --- | --- |
| `/` | Welcome page |
| `/home` | Home page |
| `/events` | Events page |
| `/events/:eventId` | Event details page |
| `/login` | Login page |
| `/register` | Registration page |
| `/booking` | Booking page |
| `/messaging` | Messaging page |
| `/users` | Users page |
| `/users/:userId` | User details page |

## Roles and Flows

The documented product model has four main user types.

### Visitor

Can browse and view events.

Cannot:

- submit bookings
- send messages
- manage events

### Participant

Can:

- browse/search events
- view event details
- submit bookings
- view own bookings
- send and receive messages

Cannot:

- create events
- approve users
- export data

### Organizer

Can:

- create events
- edit events
- publish events
- cancel events
- delete events when allowed
- view bookings for owned events
- message participants

Cannot:

- approve users
- manage all users globally
- export all event data as admin

### Admin

Can:

- view all users
- inspect user details
- approve or reject registrations
- export events in XML/JSON

## Development Notes

### Backend package layout

- `controller/`: REST API controllers.
- `entity/`: JPA entities.
- `repository/`: Spring Data repositories.
- `service/`: business/service layer.
- `enums/`: status enums.
- `Util/`: utility helpers.
- `CorsConfig.java`: CORS setup for local frontend development.

### Frontend layout

- `pages/`: route-level page components.
- `components/`: shared UI/auth route components.
- `Auth/`: role and authorization helper types.
- `App.tsx`: route registration.
- `main.tsx`: React entry point.

### Current implementation notes

- Backend runs on port `8080`.
- Frontend runs on port `5173`.
- CORS is configured for `http://localhost:5173`.
- The app currently uses local development database credentials.
- `data.sql` automatically adds demo users, events, ticket types, and bookings.
- `scripts/reset-data.sql` clears development data only when run manually.

## Security / Production Notes

The current authentication and authorization implementation is not production-ready yet.

Before production deployment, complete the auth hardening plan in:

```text
auth-production-readiness-steps.md
```

High-priority items:

- Add Spring Security.
- Use BCrypt for passwords.
- Replace direct `User` entity responses with DTOs.
- Never expose password fields from API responses.
- Implement real login session/token handling.
- Add `/api/auth/me`.
- Add `/api/auth/logout`.
- Protect backend endpoints server-side.
- Enforce role checks on admin/organizer actions.
- Enforce ownership checks for user/event resources.
- Remove `localStorage.isLoggedIn` as an auth source.
- Move production CORS origins and secrets to environment configuration.
- Do not load the seeded demo accounts in a production database.

Frontend route guards are useful for user experience, but they are not security. All real access control must be enforced by the backend.

## Useful Commands

### Backend

Run backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Run backend tests:

```powershell
cd backend
.\mvnw.cmd test
```

Reset local development data:

```powershell
$env:PGPASSWORD='postgres'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -p 5433 -U postgres -d my-postgres -f scripts\reset-data.sql
```

Restart the backend after resetting so it reloads `data.sql`.

### Frontend

Install dependencies:

```powershell
cd frontend
npm install
```

Run dev server:

```powershell
cd frontend
npm run dev
```

Build frontend:

```powershell
cd frontend
npm run build
```

Lint frontend:

```powershell
cd frontend
npm run lint
```

Preview production build:

```powershell
cd frontend
npm run preview
```

## Documentation

Project docs live in `docs/`:

- `requirementsBreakdown.md`: product requirements and functional areas.
- `rolesAndFlows.md`: visitor, participant, organizer, and admin flows.
- `pagesMap.md`: planned page structure.
- `databaseSchema.md`: draft relational schema.
- `entitiesDraft.md`: entity planning notes.
- `bookingLogic.md`: booking and capacity rules.
- `servicesLogic.md`: planned service responsibilities.
- `relatsionshipsDraft.md`: relationship planning notes.

Additional auth readiness notes:

- `auth-production-readiness-steps.md`

## Recommended Next Steps

1. Implement production-ready authentication and authorization.
2. Add booking service/controller endpoints.
3. Add role-specific frontend routes and dashboards.
4. Add admin approval workflow.
5. Add event update/publish/cancel endpoints.
6. Add integration tests for auth, ownership, bookings, and event management.
7. Move environment-specific values out of source-controlled config.
