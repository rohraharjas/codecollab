# CodeCollab

This is the **Code Collaboration Platform**, which allows users to manage workspaces, snippets, and reviews. The platform enforces role-based access control (RBAC) and includes protections like **CSRF** and **JWT** authentication for security.

## Features

- User registration and authentication with JWT
- Role-based access control (RBAC) for Admin, Developer, and Reviewer roles
- CSRF protection on sensitive routes
- Code review system for uploaded snippets
- Secure API with cookie-based CSRF token handling

## Tech Stack

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for building RESTful APIs
- **MongoDB**: NoSQL database to store users, workspaces, snippets, and reviews
- **CSRF Protection**: `csurf` middleware for securing routes
- **JWT**: JSON Web Tokens for authentication
- **CORS**: Cross-Origin Resource Sharing middleware to allow frontend communication
- **Helmet.js**: Secure HTTP headers for added protection
- **Cookie Parser**: Middleware to parse cookies sent with requests

## Installation

Follow the steps below to set up the backend server locally:

1. Clone this repository:

```bash
git clone https://github.com/your-username/codecollab-backend.git
cd codecollab-backend
```

2. Install the dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root of the project and add the following:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/codecollab
JWT_SECRET=your_jwt_secret
CSRF_SECRET=your_csrf_secret
```

- `PORT`: The port the server will run on (default is 3000).
- `MONGO_URI`: MongoDB connection URI.
- `JWT_SECRET`: A secret key for signing JWT tokens.
- `CSRF_SECRET`: A secret key for generating CSRF tokens.

4. Run the server:

```bash
npm start
```

The server will be accessible at `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST `/register`**: Register a new user
- **POST `/login`**: Login with credentials and obtain a JWT token

### Workspaces

- **POST `/workspaces`** (Admin only): Create a new workspace
- **GET `/workspaces`**: Retrieve all workspaces
- **GET `/workspaces/:id`**: Retrieve a specific workspace

### Snippets

- **POST `/snippets`** (Developer only): Upload a code snippet
- **GET `/snippets/:workspaceId`**: Retrieve all snippets in a workspace
- **GET `/snippets/:id`**: Retrieve a specific snippet

### Reviews

- **POST `/reviews/:snippetId`** (Reviewer only): Post a review on a snippet
- **PATCH `/reviews/:snippetId/status`**: Update the review status of a snippet

### CSRF Token

- **GET `/csrf-token`**: Get a CSRF token (used for form submissions and other sensitive actions)

### CORS and CSRF Protection

- **CORS**: The backend allows cross-origin requests, but only from allowed domains.
- **CSRF**: The `/csrf-token` route generates a CSRF token for secure form submissions. The CSRF token is stored in cookies and validated on protected routes.

## Middleware

### CSRF Protection

The CSRF protection is implemented using the `csurf` middleware and ensures that requests modifying server data (like POST, PATCH, DELETE) are from legitimate sources.

**How it works:**
1. The client makes a `GET /csrf-token` request to fetch the CSRF token.
2. The token is sent as a cookie, and the client must include it in the `X-CSRF-Token` header for all sensitive routes.

### Authentication & Authorization

The platform uses JWT tokens for user authentication. The JWT token is passed via the `Authorization` header as a Bearer token.

**Roles:**
- **Admin**: Can create workspaces, manage users, and perform administrative tasks.
- **Developer**: Can upload code snippets and request reviews.
- **Reviewer**: Can review code snippets and change their status.

### CORS

The backend uses the `cors` middleware to ensure that only allowed domains can make requests to the backend. 

## Frontend

This backend is designed to work with a **Streamlit frontend** that communicates via REST API.

### Sample Request

To register a new user via the API, send a POST request to `/register` with the following JSON body:

```json
{
  "username": "johnDoe",
  "email": "johndoe@example.com",
  "organization": "XYZ Corp",
  "role": "admin",
  "password": "SecurePassword123"
}
```

For login, send a POST request to `/login` with the following JSON body:

```json
{
  "email": "johndoe@example.com",
  "password": "SecurePassword123"
}
```

The response will include a JWT token, which must be used in the `Authorization` header for subsequent requests.
