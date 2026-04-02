# Frontend Codebase Search Results: "Create Event" & "Explore Event"

**Search Date:** March 20, 2026  
**Workspace:** Event Booking System - Frontend  
**Search Scope:** Complete React frontend codebase

---

## 1. ALL FILES MENTIONING "CREATE EVENT"

### Direct Text Occurrences:
| File Path | Line | Context |
|-----------|------|---------|
| [frontend/src/components/Navbar.js](frontend/src/components/Navbar.js#L35) | 35 | Navigation link: `<a href="/create-event">Create Event</a>` |
| [frontend/src/components/EventForm.js](frontend/src/components/EventForm.js#L127) | 127 | Submit button text: `'Create Event'` (conditional with loading state) |
| [frontend/src/pages/CreateEvent.js](frontend/src/pages/CreateEvent.js#L19) | 19 | Error message: `'Failed to create event'` |
| [frontend/src/styles/Pages.css](frontend/src/styles/Pages.css#L105) | 105 | CSS comment: `/* Create Event Page */` |
| [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L52) | 52 | Hero button text: `Create Event` |

### Related Code References (Functions/Methods):
| File Path | Type | Details |
|-----------|------|---------|
| [frontend/src/pages/CreateEvent.js](frontend/src/pages/CreateEvent.js#L8) | Component | `const CreateEvent = () => {}` - Main page component |
| [frontend/src/pages/CreateEvent.js](frontend/src/pages/CreateEvent.js#L12) | Function | `handleCreateEvent()` - Form submission handler |
| [frontend/src/context/EventContext.js](frontend/src/context/EventContext.js#L22) | Function | `const createEvent = async (eventData) => {}` - Context method |
| [frontend/src/services/eventService.js](frontend/src/services/eventService.js#L26) | API Service | `createEvent: async (eventData) => {}` - API endpoint call |
| [frontend/src/App.js](frontend/src/App.js#L10) | Import | `import CreateEvent from './pages/CreateEvent';` |
| [frontend/src/App.js](frontend/src/App.js#L35) | Route | `<Route path="/create-event" element={<CreateEvent />} />` |

---

## 2. ALL FILES MENTIONING "EXPLORE EVENTS" / "EXPLORE EVENT"

### Direct Text Occurrences:
| File Path | Line | Context |
|-----------|------|---------|
| [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L49) | 49 | Hero button text: `Explore Events` |

### Related Pages/Components for Event Exploration:
| Feature | Primary File | Line | Purpose |
|---------|-------------|------|---------|
| Event Calendar | [frontend/src/pages/EventCalendar.js](frontend/src/pages/EventCalendar.js#L7) | 7 | Browse approved events by date in calendar view |
| Dashboard (All Events) | [frontend/src/pages/Dashboard.js](frontend/src/pages/Dashboard.js#L2) | 2 | View all events with filtering by status |
| Event Details | [frontend/src/pages/EventDetails.js](frontend/src/pages/EventDetails.js#L6) | 6 | View complete event information |
| Featured Events | [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L85) | 85 | Homepage section showcasing featured events |
| Upcoming Events | [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L114) | 114 | Homepage section showing upcoming events |
| Past Events | [frontend/src/pages/PastEvents.js](frontend/src/pages/PastEvents.js) | - | View historical/completed events |

---

## 3. CURRENT UI STRUCTURE FOR EVENT CREATION

### Create Event Navigation & Access Points:

#### A. Navbar Navigation
**File:** [frontend/src/components/Navbar.js](frontend/src/components/Navbar.js)  
**Line:** 35  
**Implementation:**
```
<li><a href="/create-event">Create Event</a></li>
```

#### B. Homepage Hero Buttons
**File:** [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L51-L52)  
**Lines:** 51-52  
**Implementation:**
```jsx
<button className="btn-secondary btn-large" onClick={() => navigate('/create-event')}>
  Create Event
</button>
```
**CSS Classes:**
- `.btn-secondary` - Secondary button style
- `.btn-large` - Large button sizing
- Contained within `.hero-buttons` wrapper

#### C. Event Form Component
**File:** [frontend/src/components/EventForm.js](frontend/src/components/EventForm.js)  
**Line:** 127  
**Implementation:**
```jsx
<button>{loading ? 'Submitting...' : 'Create Event'}</button>
```

#### D. Create Event Page
**File:** [frontend/src/pages/CreateEvent.js](frontend/src/pages/CreateEvent.js)  
**Lines:** 26-33  
**Implementation:**
```jsx
<div className="create-event-page">
  <div className="page-header">
    <h1>Create New Event</h1>
    <p>Submit your event for admin approval</p>
  </div>
  <div className="form-container">
    <EventForm onSubmit={handleCreateEvent} loading={loading} />
  </div>
</div>
```

### Create Event Form Fields:
**File:** [frontend/src/components/EventForm.js](frontend/src/components/EventForm.js)  
**Lines:** 1-80

Available Form Fields:
- Event Title (required)
- Description (optional)
- Start Date (required)
- End Date (required)
- Location (required)
- Event Type (dropdown: 'indoor' or 'outdoor')
- Total Seats (for indoor events)
- Additional hidden/extended fields not shown in excerpt

---

## 4. CURRENT UI STRUCTURE FOR EVENT EXPLORATION

### A. Homepage Hero Section - "Explore Events" Button
**File:** [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L47-L52)  
**Lines:** 47-52  
**Implementation:**
```jsx
<button className="btn-primary btn-large" onClick={() => navigate('/calendar')}>
  Explore Events
</button>
```
**Navigation:** Directs to `/calendar` route (Event Calendar page)

### B. Event Calendar Page
**File:** [frontend/src/pages/EventCalendar.js](frontend/src/pages/EventCalendar.js)  
**Type:** Interactive calendar view with event listing  
**Features (from code):**
- React Calendar component displaying approved events
- Date selection functionality
- Event list for selected date
- Event items show:
  - Event title
  - Start time
  - Location
  - "View Details" link to individual event page

### C. Dashboard Page (All Events)
**File:** [frontend/src/pages/Dashboard.js](frontend/src/pages/Dashboard.js)  
**Type:** Grid view of all events  
**Features:**
- Status filtering (pending, approved, rejected)
- Event cards with titles, dates, locations
- "View Details" button per event
- Uses EventCard component

### D. Featured Events Section (Homepage)
**File:** [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L85-L118)  
**Type:** Featured event cards on homepage  
**Card Content:**
- Featured badge
- Event thumbnail image
- Event title
- Date with emoji (📅)
- Location with emoji (📍)
- Event type with emoji (🎯)
- "View Details" button
- "Book Now" button

### E. Upcoming Events Section (Homepage)
**File:** [frontend/src/pages/HomePage.js](frontend/src/pages/HomePage.js#L114+)  
**Type:** Grid of upcoming events  
**Uses:** EventCard component for consistent display

### F. Event Details Page
**File:** [frontend/src/pages/EventDetails.js](frontend/src/pages/EventDetails.js)  
**Type:** Comprehensive event information view  
**Displays:**
- Event banner image
- Event title and status badge
- Full description
- Start/End dates
- Location
- Event type
- Action buttons:
  - Book Seats (for indoor events)
  - Request Stalls
  - Vote for Artists
  - View Gallery

---

## 5. NAVIGATION STRUCTURE & ROUTES

### Create Event Route
**Route:** `/create-event`  
**Component:** [CreateEvent](frontend/src/pages/CreateEvent.js)  
**Access:** Navbar, Homepage Hero Button  
**AuthRequired:** Yes (inferred from form submission flow)

### Event Exploration Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Homepage with featured/upcoming events |
| `/calendar` | EventCalendar | Browse approved events by date |
| `/dashboard` | Dashboard | All events list view |
| `/event/:id` | EventDetails | Individual event details |
| `/past-events` | PastEvents | Historical events |
| `/book-event/:eventId` | BookEvent | Event booking interface |

---

## 6. CURRENT ICON USAGE IN PROJECT

### Icon Implementation Method:
**Primary Approach:** Unicode Emoji Characters (NOT external icon library)

### Icon Library Installed:
**Library:** `react-icons` version 4.7.1 (in package.json)  
**Status:** Installed but NOT currently used in components

### Current Emoji Icons Used:

#### In HomePage.js:
| Icon | Location | Usage | Context |
|------|----------|-------|---------|
| 📅 | Line 63 | Feature icon for "Easy Booking" | Features section |
| 🎟️ | Line 68 | Feature icon for "Secure Tickets" | Features section |
| 📸 | Line 73 | Feature icon for "Share Memories" | Features section |
| 🎤 | Line 78 | Feature icon for "Vote for Artists" | Features section |
| 📅 | Line 104 | Date indicator in featured events | Featured event cards |
| 📍 | Line 106 | Location indicator | Featured event cards |
| 🎯 | Line 107 | Event type indicator | Featured event cards |

#### In Navbar.js:
| Icon | Location | Usage | Context |
|------|----------|-------|---------|
| 🎉 | Logo | Site branding | Navbar logo: "🎉 EventHub" |
| ☰ | Line 27 | Mobile menu toggle | Mobile hamburger menu |
| 👤 | Line 42 | User profile indicator | Navbar user info display |

### Icon CSS Properties:
**File:** [frontend/src/styles/Pages.css](frontend/src/styles/Pages.css#L801-L805)  
**Lines:** 801-805
```css
.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}
```

---

## 7. COMPREHENSIVE FILE LISTING

### Pages (12 total):
1. [HomePage.js](frontend/src/pages/HomePage.js) - ✅ Contains "Create Event" & "Explore Events"
2. [CreateEvent.js](frontend/src/pages/CreateEvent.js) - ✅ Event creation page
3. [EventCalendar.js](frontend/src/pages/EventCalendar.js) - Event exploration by calendar
4. [Dashboard.js](frontend/src/pages/Dashboard.js) - Event exploration grid view
5. [EventDetails.js](frontend/src/pages/EventDetails.js) - Individual event details
6. [BookEvent.js](frontend/src/pages/BookEvent.js)
7. [AdminDashboard.js](frontend/src/pages/AdminDashboard.js)
8. [StallAllocation.js](frontend/src/pages/StallAllocation.js)
9. [SeatBooking.js](frontend/src/pages/SeatBooking.js)
10. [ArtistVoting.js](frontend/src/pages/ArtistVoting.js)
11. [Notifications.js](frontend/src/pages/Notifications.js)
12. [PastEvents.js](frontend/src/pages/PastEvents.js)
13. [EventGallery.js](frontend/src/pages/EventGallery.js)
14. [Login.js](frontend/src/pages/Login.js)
15. [Register.js](frontend/src/pages/Register.js)

### Components (7 total):
1. [Navbar.js](frontend/src/components/Navbar.js) - ✅ "Create Event" link
2. [EventCard.js](frontend/src/components/EventCard.js)
3. [EventForm.js](frontend/src/components/EventForm.js) - ✅ "Create Event" button
4. [SeatSelector.js](frontend/src/components/SeatSelector.js)
5. [ArtistVote.js](frontend/src/components/ArtistVote.js)
6. [StallCard.js](frontend/src/components/StallCard.js)
7. [NotificationItem.js](frontend/src/components/NotificationItem.js)

### API Services:
1. [eventService.js](frontend/src/services/eventService.js) - ✅ `createEvent()` method
2. adminService.js
3. artistService.js
4. authService.js
5. galleryService.js
6. notificationService.js
7. seatService.js
8. stallService.js

### Context/State Management:
1. [AuthContext.js](frontend/src/context/AuthContext.js)
2. [EventContext.js](frontend/src/context/EventContext.js) - ✅ `createEvent()` context method

### Styling:
1. [App.css](frontend/src/App.css)
2. [Components.css](frontend/src/styles/Components.css) - Button & component styles
3. [Pages.css](frontend/src/styles/Pages.css) - ✅ ".create-event-page" & ".hero-buttons" CSS

---

## 8. BUTTON STYLING CLASSES

### Hero Buttons (Homepage)
**File:** [frontend/src/styles/Pages.css](frontend/src/styles/Pages.css#L730-L755)

**CSS Classes Applied:**
- `.btn-primary` - Primary action (blue background)
- `.btn-secondary` - Secondary action (alternative styling)
- `.btn-large` - Large button sizing

**CSS Definition:**
```css
.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-buttons .btn-primary,
.hero-buttons .btn-secondary {
  min-width: 200px;
}
```

### Form Submit Button
**File:** [frontend/src/styles/Components.css](frontend/src/styles/Components.css)

**CSS Classes:** Inherited from global button styles in Components.css

---

## 9. EVENT CREATION WORKFLOW

### Step-by-Step User Flow:
1. User clicks "Create Event" button from:
   - Navbar navigation link
   - Homepage hero button
2. Navigates to `/create-event` route
3. CreateEvent page loads with EventForm component
4. User fills form fields (title, description, dates, location, type, seats)
5. User clicks "Create Event" button (line 127 in EventForm.js)
6. `handleCreateEvent()` function calls `eventService.createEvent()`
7. Form data sent to backend API
8. Success: Toast notification + redirect to homepage
9. Error: Toast error message displayed

**Toast Notifications:**
- Success: `'Event created successfully! Awaiting admin approval.'`
- Error: `'Failed to create event'` or custom backend message

---

## 10. EVENT EXPLORATION WORKFLOW

### Step-by-Step User Flow:
1. User clicks "Explore Events" button from homepage hero section
2. Navigates to `/calendar` route (Event Calendar page)
3. **Alternative paths:**
   - Click navbar "Calendar" link → Event Calendar
   - Click navbar "Events" link → Dashboard (all events)
   - Click navbar "Past Events" link → Past Events page
   - Browse featured events on homepage
   - Browse upcoming events on homepage
4. User views events in calendar/grid format
5. User clicks "View Details" on specific event
6. Navigates to `/event/:id` route (Event Details page)
7. User can perform actions:
   - Book seats (for indoor events)
   - Request stalls
   - Vote for artists
   - View gallery

---

## 11. SUMMARY STATUS

### ✅ Completed Implementation:
- [x] Create Event page and form
- [x] Create Event navigation links (Navbar + Homepage)
- [x] Create Event API integration
- [x] Explore Events homepage button
- [x] Event calendar view
- [x] Event dashboard/grid view
- [x] Event details page
- [x] Event card components
- [x] Emoji icon system
- [x] Button styling and layout

### 🔧 Uses External Libraries:
- `react-router-dom`: Navigation and routing
- `axios`: API calls
- `react-calendar`: Calendar component
- `react-toastify`: Toast notifications
- `react-icons`: Available but not currently used
- `date-fns`: Date formatting

### 📊 File Count:
- Total Pages: 15
- Total Components: 7
- Total Services: 8
- Total CSS Files: 3
- Total Context Files: 2

---

## 12. KEY FINDINGS

1. **Icon Strategy**: Project uses Unicode emoji characters instead of icon library (react-icons installed but unused)
2. **Navigation**: Multiple entry points for both create and explore features
3. **Responsive Design**: Uses CSS Grid and Flexbox for responsive layouts
4. **State Management**: Context API for global state (Auth + Events)
5. **API Integration**: Axios-based service layer for backend communication
6. **User Feedback**: React-Toastify for toast notifications
7. **Admin Workflow**: Events require admin approval after creation
8. **Event Types**: Distinction between indoor (with seat booking) and outdoor events

