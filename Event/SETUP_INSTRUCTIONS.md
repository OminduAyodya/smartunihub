# Setup and Running the Event Application

## Prerequisites
- Node.js installed
- MongoDB running locally

## Starting MongoDB

### Windows
If you have MongoDB installed, start it from PowerShell:
```powershell
mongod
```

Or if MongoDB is installed as a service:
```powershell
Start-Service MongoDB
```

### Install MongoDB Community
If you don't have MongoDB installed:
1. Download from https://www.mongodb.com/try/download/community
2. Follow the installation wizard
3. MongoDB should start as a service automatically

## Setup Instructions

### 1. Backend Setup
```powershell
cd e:\Event\backend
npm install
```

### 2. Seed Sample Data
First, ensure MongoDB is running, then:
```powershell
npm run seed
```

This will create:
- 2 completed past events with sample data
- 8 gallery images (4 for each event)
- 2 sample user accounts

**Sample Login Credentials:**
- Email: `organizer1@example.com`
- Password: `password123`

OR

- Email: `organizer2@example.com`
- Password: `password123`

### 3. Start Backend Server
```powershell
npm run dev
# or
npm start
```

The backend should be running on `http://localhost:5000`

### 4. Frontend Setup
In a new terminal:
```powershell
cd e:\Event\frontend
npm install
npm start
```

The frontend should open automatically on `http://localhost:3000`

## Viewing Sample Past Events

1. Open the application at `http://localhost:3000`
2. Click on **"📸 Past Events"** in the navigation bar
3. You should see:
   - **Music Festival 2025** with 4 event photos
   - **Tech Conference 2025** with 4 event photos
4. Click on any event to view full details and gallery

## First Time Setup Checklist

- [ ] MongoDB is running
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Sample data seeded (`npm run seed`)
- [ ] Backend server started (`npm run dev`)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Frontend started (`npm start`)
- [ ] Can see Past Events in navbar
- [ ] Can view sample events in Past Events page

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB service is running
- Check that MongoDB is listening on `mongodb://localhost:27017`

### Port Already in Use
- Backend: Change `PORT` environment variable
- Frontend: Change `PORT` in terminal before running `npm start`

### Module Not Found Errors
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events?status=completed` - Get completed (past) events
- `GET /api/events/:id` - Get single event

### Gallery
- `GET /api/gallery/event/:eventId` - Get event gallery
- `POST /api/gallery` - Upload photo
- `DELETE /api/gallery/:id` - Delete photo
