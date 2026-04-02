# SmartUniHub Admin Portal

Complete admin dashboard for managing events, approvals, and stalls.

## Features

- ✅ **Dashboard**: Overview of pending/approved events and system status
- ✅ **Pending Events**: Review and approve/reject event requests
- ✅ **Approved Events**: View all confirmed events with details
- ✅ **Stall Management**: Allocate and manage stalls for events
- ✅ **User Management**: View and manage platform users
- ✅ **Analytics**: Platform statistics and performance metrics

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- React Icons

## Installation

```bash
cd admin
npm install
```

## Development

```bash
npm run dev
```

Server runs at `http://localhost:5173`

## Build

```bash
npm run build
```

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminNavbar.jsx
│   │   └── AdminCard.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── events/
│   │   │   ├── PendingEventsPage.jsx
│   │   │   ├── ApprovedEventsPage.jsx
│   │   │   └── StallManagementPage.jsx
│   │   ├── UserManagementPage.jsx
│   │   └── AnalyticsPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard with statistics |
| `/admin/events/pending` | Review pending event approvals |
| `/admin/events/approved` | View approved events |
| `/admin/stalls` | Manage stall allocations |
| `/admin/users` | User management |
| `/admin/analytics` | Platform analytics |

## API Endpoints Used

- `GET /api/events?status=pending` - Get pending events
- `GET /api/events?status=approved` - Get approved events
- `PUT /api/events/:id/review` - Review (approve/reject) event
- `GET /api/users` - Get all users
- `GET /api/dashboard` - Dashboard statistics

## Admin Permissions

Only admin users can:
- View and manage pending events
- Approve or reject event requests
- Allocate stalls for events
- View all users
- Access analytics and reports

---

SmartUniHub Admin Portal © 2024
