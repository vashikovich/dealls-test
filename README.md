# Backend System for Dating App

## Service Structure

This repository contains the backend system for a dating mobile app similar to Tinder or Bumble. The primary functionalities include:

1. **User Authentication**: Sign-up, login, and token-based authentication.
2. **Swiping Logic**: Users can swipe left (pass) or swipe right (like) on profiles.
3. **Profile Management**: Users can create and update their profiles.
4. **Premium Features**: Users can unlock premium features by subscribing to packages.

### Main Components

- **Controllers**: Handle incoming HTTP requests and map them to service methods.
- **Services**: Business logic is implemented here.
- **Entities**: Database models for users, profiles, swipes, and subscriptions.
- **DTOs (Data Transfer Objects)**: Define the structure of data sent to and from the API.
- **Guards**: Used to protect endpoints, such as authentication guards.

### API Endpoints

1. **AuthController**

- **POST /auth/signup**
  Signs up a new user by accepting user email and password and creates an account.

- **POST /auth/login**
  Logs in a user by validating email and password, and returns an authentication token (JWT).

- **POST /auth/refresh**
  Refreshes an expired authentication token using a valid refresh token.

  2. **MatcherController**

- **PUT /matcher/profile**
  Allows the user to update their profile details (e.g., name, birth date, gender, bio).

- **GET /matcher/candidates**
  Retrieves a list of candidates for the user to swipe on, with params to exclude users already queued on the UI so that it won't conflict with previously retrieved ones.

- **GET /matcher/remaining-quota**
  Checks the remaining swipe quota for the current user.

- **POST /matcher/swipe**
  Allows the user to swipe on a candidate (like or dislike).

## Tech Stack

- **Node.js**: The runtime environment for the application.
- **NestJS**: A framework for building efficient, scalable Node.js applications.
- **TypeORM**: ORM to interact with the database (PostgreSQL).
- **JWT**: For token-based authentication.
- **Class-Validator**: For validating input data.

## How to Run the Service

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or later)
- PostgreSQL

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/vashikovich/dealls-test
   cd dealls-test
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Copy the `.env.example` file to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Or you can just use default values

4. **Prepare the database**
   Create database and apply migrations:

   ```bash
   npm run db:create
   npm run db:run
   ```

5. **Run the application**

   ```bash
   npm run start
   ```

   The app will start on port 3000 by default.

6. **Testing**
   For integration tests, run:
   ```bash
   npm run test
   ```
   P.S. There are 2 integration tests, but they can't run in parallel yet..

## [Bonus] Additional Enhancements

- **Linting**: ESLint and Prettier are set up to ensure code quality and consistency. You can run:
  ```bash
  npm run lint
  npm run format
  ```

## Test Cases

Please refer to the list of comprehensive test cases provided in the documentation or the test suite files for a detailed breakdown of tests covering authentication, swiping, profile management, and more.

---

For any additional information or issues, please feel free to open an issue or contribute to the repository.
