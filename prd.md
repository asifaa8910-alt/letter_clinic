# Product Requirements Document (PRD)

# AI Symptom Triage & Doctor Marketplace

**Version:** 1.0  
**Project Type:** Full Stack MERN Application  
**Platform:** Web Application (Localhost)  
**Tech Stack:** MongoDB, Express.js, React.js (Vite), Node.js  
**Authentication:** JWT + Role-Based Access Control (RBAC)

---

# 1. Product Overview

## Purpose

Develop a full-stack healthcare platform where patients can assess symptoms using an AI-powered triage system, discover verified doctors, book appointments, attend video consultations, receive digital prescriptions, and manage follow-up care.

The application will run entirely on localhost and demonstrate production-level architecture using the MERN stack.

---

# 2. Goals

- Provide AI-assisted symptom assessment.
- Help patients find the appropriate medical specialist.
- Simplify appointment booking.
- Enable online consultations.
- Digitize prescriptions.
- Manage doctor verification.
- Provide an administrative dashboard.
- Demonstrate scalable MERN architecture.

---

# 3. User Roles

## Patient

- Register/Login
- Manage profile
- Submit symptoms
- View AI recommendations
- Search doctors
- Book appointments
- Attend consultations
- View prescriptions
- Submit reviews

---

## Doctor

- Register
- Complete verification
- Manage profile
- Configure availability
- Accept appointments
- Conduct consultations
- Generate prescriptions
- View reviews

---

## Admin

- Verify doctors
- Manage users
- Manage appointments
- Monitor platform activity
- View analytics

---

# 4. Core Modules

## Authentication

- Registration
- Login
- Logout
- JWT Authentication
- Password Management
- Role-Based Authorization

---

## AI Symptom Triage

Patient submits:

- Age
- Gender
- Symptoms
- Duration
- Severity

System returns:

- Suggested Specialist
- Urgency Level
- Possible Conditions
- Confidence Score

> AI implementation may initially use rule-based logic for localhost development.

---

## Doctor Marketplace

Features:

- Search doctors
- Filter by specialization
- Filter by experience
- Filter by consultation fee
- View ratings
- View availability

---

## Appointment Management

- Book appointment
- Cancel appointment
- Reschedule appointment
- Appointment history
- Status tracking

---

## Slot Management

Doctors can:

- Create slots
- Update slots
- Delete slots
- Mark unavailable

---

## Video Consultation

- Join consultation
- Audio
- Video
- End consultation

---

## E-Prescription

Doctor can:

- Add medicines
- Dosage
- Duration
- Instructions

Patient can:

- View
- Download

---

## Reviews

Patients can:

- Rate doctor
- Write review
- Edit review

---

## Doctor Verification

Doctors upload:

- Medical License
- Degree
- Government ID

Admin:

- Approve
- Reject
- Request modifications

---

## Reminder Engine

- Appointment reminders
- Medicine reminders
- Follow-up reminders

---

## Admin Dashboard

- User management
- Doctor management
- Appointment management
- Reports
- Analytics

---

# 5. Frontend Requirements

Develop using:

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

### Required Pages

### Public

- Landing Page
- Login
- Register
- About
- Contact

### Patient

- Dashboard
- Profile
- Symptom Assessment
- Doctor Marketplace
- Appointment History
- Prescription History
- Notifications

### Doctor

- Dashboard
- Profile
- Availability
- Appointments
- Prescriptions
- Reviews

### Admin

- Dashboard
- User Management
- Doctor Verification
- Appointment Management
- Reports

---

# 6. Backend Requirements

Develop RESTful APIs using:

- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

Architecture:

```
Controllers
Routes
Models
Middleware
Services
Utils
Config
```

---

# 7. Database Collections

- Users
- Patients
- Doctors
- DoctorVerifications
- Appointments
- Slots
- SymptomReports
- Prescriptions
- Reviews
- Notifications
- Reminders

---

# 8. API Requirements

Target approximately **60–70 REST APIs**.

### Authentication

- Register
- Login
- Logout
- Profile
- Password Management

### Patient

- Profile
- Symptoms
- Appointments
- Prescriptions

### Doctor

- Profile
- Slots
- Appointments
- Prescriptions

### Marketplace

- Doctor Search
- Filters
- Availability

### AI

- Analyze Symptoms
- Recommendation History

### Appointment

- Create
- Update
- Cancel
- Complete

### Reviews

- Create
- Update
- Delete

### Admin

- Users
- Doctors
- Verification
- Reports

---

# 9. Non-Functional Requirements

- Modular architecture
- RESTful API design
- Secure authentication
- Input validation
- Responsive UI
- Clean code structure
- Maintainable codebase
- Localhost deployment
- Error handling
- Consistent API responses

---

# 10. Security Requirements

- JWT Authentication
- Password hashing (bcrypt)
- Role-Based Access Control
- Request validation
- Protected routes
- Secure file uploads
- Environment variables
- MongoDB injection prevention

---

# 11. Folder Structure

```
client/
    src/
        components/
        pages/
        layouts/
        routes/
        hooks/
        context/
        services/
        utils/

server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
```

---

# 12. Project Deliverables

The completed application must include:

- Three user roles
- Authentication system
- AI symptom triage
- Doctor marketplace
- Appointment booking
- Slot management
- Video consultation interface
- Digital prescription management
- Review system
- Doctor verification workflow
- Reminder engine
- Admin dashboard
- Approximately 60 REST APIs
- Local MongoDB integration
- Fully responsive React frontend
- Modular Express backend

---

# 13. Success Criteria

The project will be considered complete when:

- All three user roles function correctly.
- Authentication and authorization are implemented.
- CRUD operations work across all modules.
- The AI triage module recommends specialists based on symptoms.
- Appointment scheduling and slot management function correctly.
- Doctors can generate prescriptions.
- Admin can verify doctors and manage platform data.
- The application runs entirely on localhost using the MERN stack.
- Code follows clean architecture and REST API best practices.

---

# Development Constraint

This project is strictly a **MERN Stack application** intended for **localhost development**.

Do not use Firebase, Supabase, Next.js, or external backend services. Build the frontend with React (Vite) and the backend with Node.js, Express.js, and MongoDB. Structure the project using scalable, modular architecture and production-quality coding practices.