# Fintech App

A Node.js and Express REST API for a fintech application with user authentication, account management, transactions, and admin features.

## Overview

This project provides backend services for a financial platform where users can:

- create and log in to user accounts
- manage financial accounts
- perform and monitor transactions
- interact with admin endpoints for system operations

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment configuration

## Project Structure

```bash
.
├── admin/
│   ├── admin.controller.js
│   ├── admin.model.js
│   └── admin.route.js
├── config/
│   └── database.js
├── middleware/
│   ├── authenticate.js
│   └── validator.js
├── models/
│   ├── bvn.model.js
│   └── nin.model.js
├── modules/
│   ├── accounts/
│   │   ├── account.controller.js
│   │   └── account.route.js
│   ├── transactions/
│   │   ├── transaction.controller.js
│   │   ├── transaction.route.js
│   │   └── transction.model.js
│   └── users/
│       ├── user.controller.js
│       ├── user.model.js
│       └── user.route.js
├── services/
│   └── nibss.service.js
├── utils/
│   └── helper.js
├── app.js
├── index.js
├── package.json
└── README.md
```

## Features

- User registration and login
- JWT-based protected routes
- Account and transaction endpoints
- MongoDB persistence
- Modular controller, model, and route structure

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or later recommended)
- MongoDB instance or MongoDB Atlas connection
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the project folder
3. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/fintech-app
JWT_SECRET=your_jwt_secret_here
```

## Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server runs on the port defined in `PORT` (default: `8000`).

## API Endpoints

### User Routes

- `POST /api/user/create-user`
- `POST /api/user/login`

### Admin Routes

- `POST /api/admin/...`

### Account Routes

- `POST /api/account/...`

### Transaction Routes

- `POST /api/transaction/...`

## Notes

- The app uses Express middleware and modular route organization.
- Authentication is enforced via the middleware in `middleware/authenticate.js`.
- MongoDB connection is established in `config/database.js`.

## License

This project is licensed under the ISC license.
