# Event Booking System - MERN Stack

A comprehensive event booking and management system with React frontend and MERN backend.

## Features

### User Features
1. **Create New Events** - Users can create events and submit for admin approval
2. **Submit Events for Admin Approval** - Events require admin review before publishing
3. **View Approved Events in Calendar** - Interactive calendar view of all approved events
4. **Request Stalls for Events** - Vendors can request stall space for events
5. **Display Stall Allocation Details** - View available stalls and booking options
6. **Vote for Event Artists** - Community voting for event entertainment
7. **Book Seats for Indoor Events** - Interactive seat booking for indoor events
8. **Send Event Notifications** - Automated notifications for event updates
9. **View Past Event Details** - Archive of completed events
10. **View Event Photo Gallery** - Photo gallery for event memories

### Admin Features
1. **Approve or Reject Events** - Admin dashboard for event management
2. **View Analytics** - Event statistics and insights

## Project Structure

```
Event/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Stall.js
│   │   ├── Artist.js
│   │   ├── Seat.js
│   │   ├── Notification.js
│   │   └── Gallery.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── stalls.js
│   │   ├── artists.js
│   │   ├── seats.js
│   │   ├── notifications.js
│   │   ├── gallery.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── email.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── EventCard.js
    │   │   ├── EventForm.js
    │   │   ├── SeatSelector.js
    │   │   ├── ArtistVote.js
    │   │   ├── StallCard.js
    │   │   └── NotificationItem.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── CreateEvent.js
    │   │   ├── EventCalendar.js
    │   │   ├── EventDetails.js
    │   │   ├── AdminDashboard.js
    │   │   ├── StallAllocation.js
    │   │   ├── SeatBooking.js
    │   │   ├── ArtistVoting.js
    │   │   ├── Notifications.js
    │   │   ├── EventGallery.js
    │   │   └── PastEvents.js
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── eventService.js
    │   │   ├── stallService.js
    │   │   ├── artistService.js
    │   │   ├── seatService.js
    │   │   ├── notificationService.js
    │   │   ├── galleryService.js
    │   │   └── adminService.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── EventContext.js
    │   ├── styles/
    │   │   ├── Components.css
    │   │   └── Pages.css
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .gitignore
```

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file and configure:
```
MONGODB_URI=mongodb://localhost:27017/eventbooking
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open browser and navigate to `http://localhost:3000`

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

### Frontend
- React 18
- React Router v6
- Axios
- React Calendar
- React Icons
- React Toastify
- React Image Gallery

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Events
- GET `/api/events` - Get all events
- POST `/api/events` - Create event
- GET `/api/events/:id` - Get event details
- PUT `/api/events/:id` - Update event

### Stalls
- GET `/api/stalls/event/:eventId` - Get stalls for event
- POST `/api/stalls` - Request stall
- GET `/api/stalls/:id` - Get stall details

### Artists
- GET `/api/artists/event/:eventId` - Get artists for event
- POST `/api/artists/:id/vote` - Vote for artist

### Seats
- GET `/api/seats/event/:eventId` - Get seats for event
- POST `/api/seats` - Book seats

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark as read

### Gallery
- GET `/api/gallery/event/:eventId` - Get gallery
- POST `/api/gallery` - Upload photo
- DELETE `/api/gallery/:id` - Delete photo

### Admin
- GET `/api/admin/events/pending` - Get pending events
- POST `/api/admin/events/:id/approve` - Approve event
- POST `/api/admin/events/:id/reject` - Reject event

## Features Implemented

✅ Event creation with admin approval
✅ Event calendar view
✅ Seat booking system
✅ Stall allocation
✅ Artist voting system
✅ Photo gallery
✅ Notifications
✅ Admin dashboard
✅ User authentication
✅ Responsive design

## Future Enhancements

- Payment integration
- Email notifications
- SMS alerts
- Real-time updates with WebSocket
- Advanced analytics dashboard
- Mobile app
- Social media integration

## License

ISC
