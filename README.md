# Dental Center Management Dashboard

A comprehensive dental practice management system built with React, Redux, and Tailwind CSS. This application provides role-based access for both dental administrators and patients to manage appointments, treatments, and medical records.

## 🚀 Live Demo

[View Live Application](https://dental-flow-eta.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles & Access](#user-roles--access)
- [Data Management](#data-management)
- [Architecture Decisions](#architecture-decisions)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

## ✨ Features

### Admin (Dentist) Features
- **Dashboard**: Comprehensive overview with KPIs, revenue charts, and recent activity
- **Patient Management**: Add, edit, delete, and search patient records
- **Appointment Management**: Schedule and manage patient appointments
- **Treatment Records**: Document treatments, costs, and upload files
- **Analytics**: Revenue tracking and treatment statistics

### Patient Features
- **Personal Dashboard**: View upcoming appointments and treatment history
- **Appointment History**: Complete record of all dental visits
- **Medical Records**: Access to treatment details, costs, and files

### Common Features
- **Secure Authentication**: Role-based login system
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **File Management**: Upload and manage treatment-related documents
- **Real-time Updates**: Instant data synchronization across components

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with JSX
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dental-center-dashboard.git
   cd dental-center-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

#### Admin Access
- **Email**: `admin@entnt.in`
- **Password**: `admin123`

#### Patient Access
- **Email**: `john@entnt.in`
- **Password**: `patient123`

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.tsx
│   ├── Dashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── RecentAppointments.tsx
│   │   └── RevenueChart.tsx
│   ├── Layout/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── Patients/
│       ├── PatientList.tsx
│       ├── PatientModal.tsx
│       ├── MyAppointments.tsx
│       └── MyRecords.tsx
├── hooks/
│   └── redux.ts
├── store/
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── patientsSlice.ts
│       └── incidentsSlice.ts
├── types/
│   └── index.ts
├── utils/
│   ├── mockData.ts
│   └── storage.ts
├── App.tsx
└── main.tsx
```

## 👥 User Roles & Access

### Admin (Dentist)
- Full system access
- Patient management (CRUD operations)
- Appointment scheduling and management
- Treatment documentation
- Revenue and analytics dashboard
- File upload and management

### Patient
- Personal dashboard view
- Own appointment history
- Treatment records access
- File downloads (invoices, X-rays)
- Profile information view

## 💾 Data Management

### Local Storage Structure
The application uses localStorage to simulate a backend database:

```javascript
// Users authentication data
localStorage.setItem('dentalUsers', JSON.stringify(users));

// Patient records
localStorage.setItem('dentalPatients', JSON.stringify(patients));

// Treatment incidents/appointments
localStorage.setItem('dentalIncidents', JSON.stringify(incidents));

// Current user session
localStorage.setItem('currentUser', JSON.stringify(user));
```

### Data Models

#### User
```typescript
interface User {
  id: string;
  email: string;
  password: string;
  role: 'Admin' | 'Patient';
  patientId?: string;
}
```

#### Patient
```typescript
interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email?: string;
  address?: string;
  healthInfo: string;
  emergencyContact?: string;
  createdAt: string;
}
```

#### Incident (Appointment/Treatment)
```typescript
interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  nextAppointmentDate?: string;
  files?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}
```

## 🏗 Architecture Decisions

### State Management
- **Redux Toolkit**: Chosen for predictable state management and excellent DevTools
- **Slice Pattern**: Organized state by feature (auth, patients, incidents)
- **Typed Hooks**: Custom hooks for type-safe Redux usage

### Component Architecture
- **Functional Components**: Modern React with hooks
- **Component Composition**: Reusable components with clear separation of concerns
- **Props Interface**: TypeScript interfaces for type safety

### Styling Approach
- **Tailwind CSS**: Utility-first CSS for rapid development
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Design System**: Consistent color palette and spacing scale

### File Handling
- **Base64 Encoding**: Files stored as base64 strings in localStorage
- **Blob URLs**: For file preview and download functionality
- **Type Validation**: File type checking for uploads

### Routing Strategy
- **Protected Routes**: Role-based route protection
- **Nested Routing**: Organized routes by user role
- **Navigation Guards**: Automatic redirects based on authentication state