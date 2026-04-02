import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import RequestStall from './pages/RequestStall';
import EditStall from './pages/EditStall';
import StallAllocationDetailsPage from './pages/StallAllocationDetailsPage';
import BookEvent from './pages/BookEvent';
import EventCalendar from './pages/EventCalendar';
import EventDetails from './pages/EventDetails';
import AdminDashboard from './pages/AdminDashboard';
import StallAllocation from './pages/StallAllocation';
import SeatBooking from './pages/SeatBooking';
import ArtistVoting from './pages/ArtistVoting';
import Notifications from './pages/Notifications';
import EventGallery from './pages/EventGallery';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <Navbar />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/request-stall" element={<RequestStall />} />
              <Route path="/edit-stall/:stallId" element={<EditStall />} />
              <Route path="/stall-allocations" element={<StallAllocationDetailsPage />} />
              <Route path="/book-event/:eventId" element={<BookEvent />} />
              <Route path="/calendar" element={<EventCalendar />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/stalls/:eventId" element={<StallAllocation />} />
              <Route path="/seats/:eventId" element={<SeatBooking />} />
              <Route path="/artists/:eventId" element={<ArtistVoting />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/gallery/:eventId" element={<EventGallery />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
