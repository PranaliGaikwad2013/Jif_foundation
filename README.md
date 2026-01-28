# Volunteer Management System

A full-stack web application for managing volunteers with Laravel backend and React frontend.

## Features

- **User Authentication**: Login and Register functionality with role-based access (Admin/User)
- **Admin Dashboard**: Overview with volunteer statistics (Total, Active, Inactive counts)
- **Volunteer Management**: Full CRUD operations for volunteers
  - Add new volunteers with profile image upload
  - Edit existing volunteers
  - Delete volunteers
  - Export volunteers to CSV
- **Responsive Design**: Built with Bootstrap 5

## Tech Stack

### Backend

- Laravel 11
- Laravel Sanctum (API Authentication)
- Mysql Database

### Frontend

- React 18
- React Router v6
- Bootstrap 5
- Axios

## Project Structure

```
newTask/
├── backend/           # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── VolunteerController.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Volunteer.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── public/
│       └── upload/    # Profile images storage
│
└── frontend/          # React App
    └── src/
        ├── components/
        │   ├── AdminLayout.js
        │   └── ProtectedRoute.js
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   └── admin/
        │       ├── Dashboard.js
        │       └── Volunteers.js
        └── services/
            └── api.js
```

## Installation

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   composer install
   ```

3. Copy environment file:

   ```bash
   cp .env.example .env
   ```

4. Generate application key:

   ```bash
   php artisan key:generate
   ```

5. Run migrations and seed:

   ```bash
   php artisan migrate --seed
   ```

6. Create upload directory:

   ```bash
   mkdir public/upload
   ```

7. Start the server:
   ```bash
   php artisan serve
   ```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:

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

The frontend will run on `http://localhost:3000`

## Default Credentials

### Admin User

- Email: `admin@admin.com`
- Password: `password`

### Regular User

- Email: `user@user.com`
- Password: `password`

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/user` - Get authenticated user (requires auth)

### Volunteers (requires auth)

- `GET /api/volunteers` - List all volunteers
- `GET /api/volunteers/stats` - Get volunteer statistics
- `GET /api/volunteers/export` - Export volunteers to CSV
- `POST /api/volunteers` - Create new volunteer
- `GET /api/volunteers/{id}` - Get single volunteer
- `PUT /api/volunteers/{id}` - Update volunteer
- `DELETE /api/volunteers/{id}` - Delete volunteer

## Database Schema

### Users Table

| Column     | Type      | Description           |
| ---------- | --------- | --------------------- |
| id         | bigint    | Primary key           |
| name       | string    | User's name           |
| email      | string    | User's email (unique) |
| password   | string    | Hashed password       |
| role       | enum      | 'admin' or 'user'     |
| created_at | timestamp | Creation timestamp    |
| updated_at | timestamp | Update timestamp      |

### Volunteers Table

| Column        | Type      | Description                |
| ------------- | --------- | -------------------------- |
| id            | bigint    | Primary key                |
| name          | string    | Volunteer's name           |
| email         | string    | Volunteer's email (unique) |
| country_code  | string    | Phone country code         |
| mobile        | string    | Mobile number              |
| profile_image | string    | Image filename (nullable)  |
| status        | enum      | 'active' or 'inactive'     |
| created_at    | timestamp | Creation timestamp         |
| updated_at    | timestamp | Update timestamp           |

## Screenshots

### Login Page

![Login Page](https://github.com/user-attachments/assets/14e9ae6d-959d-42ee-ba4c-e793b43a43da)

- Clean login form with email and password fields
- Link to registration page
- Demo credentials displayed

### Register Page
![Register Page](https://github.com/user-attachments/assets/addc945f-5152-44cb-8ba8-c941226c08e5)

### Admin Dashboard

![Admin Dashboard](https://github.com/user-attachments/assets/fa1a3380-af14-419d-8f33-c8c027bad61f)

- Statistics cards showing Total, Active, and Inactive volunteer counts
- Quick action buttons

### Volunteers Management

![Volunteers Management](https://github.com/user-attachments/assets/ede8418d-dceb-4b36-88ae-ce5902df58b2)

- Table listing all volunteers with profile images
- Add/Edit volunteer modal with form validation
- Delete confirmation modal
- Export to CSV functionality
- Search, filter, and pagination support

### Add/Edit Volunteer Modal

![Add/Edit Volunteer](https://github.com/user-attachments/assets/e80c95c2-8d93-45b6-9daa-6b41bffaff20)

- Profile image upload with preview
- Form validation for required fields
- Status selection (active/inactive)
