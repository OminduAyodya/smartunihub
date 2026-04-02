# SmartUniHub - Canteen Assistance Module (MERN)

This project contains a complete **Canteen Assistance Module** for SmartUniHub.

## Tech Stack

- MongoDB
- Express.js
- React.js (Vite)
- Node.js
- Tailwind CSS
- Axios

## Project Structure

```text
ITPMASSI/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      server.js
  frontend/
    src/
      components/
      pages/
      services/
      App.js
      main.jsx
```

## Backend Setup

1. Open terminal and go to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

4. Update `.env` with your MongoDB connection string:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartunihub
```

5. Seed sample data:

```bash
npm run seed
```

6. Start backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## Frontend Setup

1. Open a new terminal and go to frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Food APIs

- `GET /foods` - Get all food items
- `POST /foods` - Add food item
- `PUT /foods/:id` - Update food stock

### Request APIs

- `POST /request` - Create food request
- `GET /request/:userId` - Get requests by user
- `PUT /request/:id/accept` - Accept request
- `PUT /request/:id/reject` - Reject request
- `PUT /request/:id/complete` - Complete request

### User API

- `GET /users` - Get all users (used for mock nearby-student selection)

## Feature Summary

- View food list, stock, price, and offers
- Send food collection requests to nearby students
- Accept, reject, and complete requests
- Track statuses: Pending / Accepted / Rejected / Completed
- View completed order history with service charges
- Dashboard cards for totals, active requests, completed orders, and earnings

## Notes

- The frontend includes fallback dummy data when backend is unavailable.
- For full functionality, run backend and seed data first.
