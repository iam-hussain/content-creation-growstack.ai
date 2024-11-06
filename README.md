
# Content Creator

## Overview

This project consists of a backend server and a frontend client. The backend is built with an Express Apollo GraphQL server, while the frontend is a Next.js application.

## Getting Started

### Prerequisites

- Node.js
- npm

### Backend (Express Apollo GraphQL Server)

The backend is an Express server with Apollo GraphQL, providing a GraphQL API. Follow these steps to set up and start the server.

#### Setup Instructions

1. Navigate to the `backend` directory:

   ```bash
   cd ./backend
   ```

2. Copy the `.env.example` file to `.env` and update it with your configuration, including the required `CHAT GPT API Key`.

   ```bash
   cp .env.example .env
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

The backend server should now be running at [http://localhost:4000/graphql](http://localhost:4000/graphql).

### Frontend (Next.js Client)

The frontend is a Next.js application that communicates with the backend GraphQL API.

#### Setup Instructions

1. Navigate to the `frontend` directory:

   ```bash
   cd ./frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the Next.js development server:

   ```bash
   npm run dev
   ```

The frontend client should now be accessible at [http://localhost:3000](http://localhost:3000).

---

## Technologies Used

- **Backend**: Express, Apollo Server, GraphQL, Prisma
- **Frontend**: Next.js, React

