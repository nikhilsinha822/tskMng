# App Setup

## Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/) (for development)

## Setup Instructions

### 1. Clone the Repository
```sh
# Clone the project
$ git clone https://github.com/nikhilsinha822/tskMng.git
$ cd tskMng
```

### 2. Install Dependencies
```sh
$ npm install
```

### 3. Install Nodemon Globally
```sh
$ npm install -g nodemon
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET="your_jwt_secret"
```
Replace `USER`, `PASSWORD`, and `DATABASE_NAME` with your actual PostgreSQL credentials.

### 5. Set Up Prisma
```sh
# Initialize Prisma
$ npx prisma migrate dev --name init

# Generate Prisma Client
$ npx prisma generate
```

### 6. Start the Server
```sh
$ npm run dev
```
The server will start running on `http://localhost:3500/` (or your configured port).

## API Routes

### Authentication Routes
| Method | Endpoint  | Description |
|--------|----------|-------------|
| POST   | `/auth/login` | User login |

### Project Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/projects` | Get all projects |
| POST   | `/projects` | Create a project |
| PUT    | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |
| GET    | `/projects/:projectId/tasks` | Get all tasks of a project |
| POST   | `/projects/:projectId/tasks` | Create a task for a project |

### Task Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/tasks` | Get all tasks by filter |
| PUT    | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/users` | Get all users |
| POST   | `/users` | Create a user |
| PUT    | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

## Middleware
- `verifyJWT` is used to protect certain routes and requires a valid JWT token.

## Notes
- Modify database settings in `.env` as per your requirements.
- Ensure PostgreSQL is running before starting the application.
- Use `npx prisma studio` to interact with the database visually.



